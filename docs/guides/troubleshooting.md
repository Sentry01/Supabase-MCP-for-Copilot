# Troubleshooting Guide

## Common Issues and Solutions

### Connection Issues

#### Server Won't Start
**Symptoms:**
- `Error: Missing required environment variables`
- `Error: Could not connect to Supabase`

**Solutions:**
1. Check `.env` file exists and has all required variables
2. Verify Supabase URL and API key are correct
3. Ensure Node.js version is 18 or higher
4. Check network connectivity to Supabase

#### VS Code Integration Problems
**Symptoms:**
- MCP server not appearing in VS Code
- "Cannot connect to MCP server" error

**Solutions:**
1. Verify VS Code settings.json configuration
2. Check server process is running
3. Ensure paths in VS Code configuration are absolute
4. Restart VS Code after configuration changes

### Authentication Issues

#### Invalid API Key
**Symptoms:**
- "Invalid API key" errors
- 401 Unauthorized responses

**Solutions:**
1. Check API key in .env file
2. Verify key has required permissions in Supabase
3. Ensure key is being passed in X-API-Key header
4. Check for any key rotation or expiration

#### Rate Limiting
**Symptoms:**
- "Rate limit exceeded" errors
- 429 Too Many Requests responses

**Solutions:**
1. Check current rate limit configuration
2. Use unique X-Client-ID headers for different clients
3. Implement request batching if needed
4. Consider increasing rate limits in configuration

### Query Issues

#### Query Execution Failures
**Symptoms:**
- "Query execution failed" errors
- Timeout errors

**Solutions:**
1. Check query syntax
2. Verify table and column names
3. Check for proper parameter usage
4. Review query complexity and performance

#### Data Masking Problems
**Symptoms:**
- Sensitive data not being masked
- Over-aggressive masking

**Solutions:**
1. Check security middleware configuration
2. Review sensitive fields configuration
3. Verify RLS policies in Supabase
4. Check masking trigger is properly installed

### Database Function Issues

#### Schema Information Not Available
**Symptoms:**
- Empty schema responses
- "Function not found" errors

**Solutions:**
1. Verify database functions are installed
2. Check function permissions
3. Review Supabase SQL editor logs
4. Re-run database_functions.sql

#### Security Policies Not Working
**Symptoms:**
- RLS not being enforced
- Masking not applying

**Solutions:**
1. Check if RLS is enabled on tables
2. Verify security policies are installed
3. Review policy definitions
4. Check user/role permissions

## Debugging Steps

### 1. Server Diagnostics
```bash
# Check server logs
npm start

# Check environment
node -v
printenv | grep SUPABASE
```

### 2. Database Verification
```sql
-- Check if functions exist
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public';

-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

### 3. Security Verification
```sql
-- Check policies
SELECT * FROM pg_policies;

-- Check permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public';
```

## Getting Help

### Debug Mode
Enable debug mode for more detailed logs:
```
LOG_LEVEL=debug npm start
```

### Common Error Codes
- `401`: Authentication issue
- `403`: Permission denied
- `429`: Rate limit exceeded
- `500`: Server error
- `503`: Service unavailable

### Support Resources
1. Check [GitHub Issues](https://github.com/yourusername/mcp-server-supabase/issues)
2. Review Supabase documentation
3. Join Supabase Discord community
4. Contact MCP protocol support