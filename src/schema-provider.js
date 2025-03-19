class SchemaProvider {
  constructor(supabaseClient) {
    this.supabase = supabaseClient;
  }
  
  async getFullSchema() {
    try {
      // Query Supabase for full database schema
      const { data, error } = await this.supabase
        .rpc('get_schema_information');
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get schema: ${error.message}`);
    }
  }
  
  async getTableInfo(tableName) {
    try {
      if (!tableName) {
        throw new Error('Table name must be provided');
      }
      
      // Get detailed information about a specific table
      const { data, error } = await this.supabase
        .rpc('get_table_information', { table_name: tableName });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get table info: ${error.message}`);
    }
  }

  async getTableColumns(tableName) {
    try {
      if (!tableName) {
        throw new Error('Table name must be provided');
      }

      const { data, error } = await this.supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_name', tableName);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get table columns: ${error.message}`);
    }
  }

  async getForeignKeys(tableName) {
    try {
      if (!tableName) {
        throw new Error('Table name must be provided');
      }

      const { data, error } = await this.supabase
        .from('information_schema.key_column_usage')
        .select(`
          constraint_name,
          column_name,
          referenced_table_name,
          referenced_column_name
        `)
        .eq('table_name', tableName)
        .not('referenced_table_name', 'is', null);

      if (error) throw error;
      return data;
    } catch (error) {
      throw new Error(`Failed to get foreign keys: ${error.message}`);
    }
  }
}

module.exports = { SchemaProvider };