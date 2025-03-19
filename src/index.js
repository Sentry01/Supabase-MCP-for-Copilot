const { MCPServer } = require('@modelcontextprotocol/server');
const { getSupabaseClient } = require('./supabase-client');
const { SchemaProvider } = require('./schema-provider');
const { QueryHandler } = require('./query-handler');
const config = require('./config');

class SupabaseMCPServer {
  constructor() {
    this.supabaseClient = getSupabaseClient(config.supabase.url, config.supabase.key);
    this.schemaProvider = new SchemaProvider(this.supabaseClient);
    this.queryHandler = new QueryHandler(this.supabaseClient, config.security.allowedQueryTypes);
    this.server = new MCPServer({
      name: 'mcp-server-supabase',
      version: '1.0.0',
    });
  }

  async initialize() {
    // Register handlers for MCP protocol
    this.server.registerHandler('getSchema', async () => {
      return await this.schemaProvider.getFullSchema();
    });

    this.server.registerHandler('getTableInfo', async (params) => {
      return await this.schemaProvider.getTableInfo(params.tableName);
    });

    this.server.registerHandler('getTableColumns', async (params) => {
      return await this.schemaProvider.getTableColumns(params.tableName);
    });

    this.server.registerHandler('getForeignKeys', async (params) => {
      return await this.schemaProvider.getForeignKeys(params.tableName);
    });

    this.server.registerHandler('executeQuery', async (params) => {
      return await this.queryHandler.executeWithTimeout(
        params.query,
        params.params,
        config.security.queryTimeout
      );
    });
  }

  async start() {
    try {
      await this.initialize();
      await this.server.start();
      console.log(`MCP Supabase server is running on ${config.server.host}:${config.server.port}`);
    } catch (error) {
      console.error('Failed to start MCP server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new SupabaseMCPServer();
server.start();