# Installation Guide

## Prerequisites
- Node.js 18 or later
- A Supabase project with admin access
- VS Code with MCP protocol support

## Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mcp-server-supabase.git
cd mcp-server-supabase
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase
1. Log into your Supabase project dashboard
2. Navigate to SQL Editor
3. Execute the database functions from `sql/database_functions.sql`
4. Execute the security policies from `sql/security_policies.sql`

### 4. Environment Setup
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Update the `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_KEY=your-service-key
   ```

### 5. VS Code Integration
1. Open VS Code settings (Command Palette → "Preferences: Open Settings (JSON)")
2. Add the MCP server configuration:
   ```json
   "mcp": {
     "servers": {
       "mcp-server-supabase": {
         "command": "node",
         "args": [
           "/path/to/mcp-server-supabase/src/index.js"
         ],
         "env": {
           "SUPABASE_URL": "https://your-project-ref.supabase.co",
           "SUPABASE_SERVICE_KEY": "your-service-key",
           "ALLOWED_QUERY_TYPES": "SELECT"
         }
       }
     }
   }
   ```

## Verification
1. Start the server:
   ```bash
   npm start
   ```
2. Open VS Code and ensure the MCP server appears in the MCP panel
3. Try a simple schema query to verify the connection

## Security Setup
1. Review and customize rate limits in `src/middleware/security.js`
2. Configure sensitive field masking in `sql/security_policies.sql`
3. Set up row-level security policies for your tables

## Next Steps
- Review the [Usage Guide](./usage.md) for examples
- Check [Troubleshooting](./troubleshooting.md) if you encounter issues
- Read about [Security Best Practices](./security.md)