class QueryHandler {
  constructor(supabaseClient, allowedQueryTypes = ['SELECT']) {
    this.supabase = supabaseClient;
    this.allowedQueryTypes = new Set(allowedQueryTypes.map(type => type.toUpperCase()));
  }
  
  validateQuery(queryString) {
    if (!queryString || typeof queryString !== 'string') {
      throw new Error('Query must be a non-empty string');
    }

    const normalizedQuery = queryString.trim().toUpperCase();
    
    // Check if query starts with allowed query types
    const queryType = this.allowedQueryTypes.values().next().value;
    if (!Array.from(this.allowedQueryTypes).some(type => normalizedQuery.startsWith(type))) {
      throw new Error(`Query type not allowed. Allowed types: ${Array.from(this.allowedQueryTypes).join(', ')}`);
    }

    // Basic SQL injection prevention checks
    const dangerousPatterns = [
      ';.*--',           // Multiple statements with comment
      ';.*\/\*',         // Multiple statements with block comment
      'UNION.*SELECT',   // UNION-based injection
      'INTO.*OUTFILE',   // File operations
      'INTO.*DUMPFILE',  // File operations
      'EXECUTE.*IMMEDIATE', // Dynamic execution
      'EXEC.*sp_',       // Stored procedure execution
      'xp_cmdshell'      // Command execution
    ];

    const hasDangerousPattern = dangerousPatterns.some(pattern => 
      new RegExp(pattern, 'i').test(queryString)
    );

    if (hasDangerousPattern) {
      throw new Error('Query contains potentially dangerous patterns');
    }

    return true;
  }
  
  async execute(queryString, params = {}) {
    try {
      // Validate query before execution
      this.validateQuery(queryString);
      
      // Execute the query through Supabase
      const { data, error } = await this.supabase
        .rpc('execute_query', {
          query_string: queryString,
          query_params: params
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  async executeWithTimeout(queryString, params = {}, timeoutMs = 5000) {
    return Promise.race([
      this.execute(queryString, params),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query execution timed out')), timeoutMs)
      )
    ]);
  }
}

module.exports = { QueryHandler };