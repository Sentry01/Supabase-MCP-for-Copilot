# Usage Guide

## Basic Usage
The MCP server provides several commands for interacting with your Supabase database:

### 1. Schema Information
Get information about your database schema:
```
What tables do I have in my database?
```

Get detailed information about a specific table:
```
Show me the columns in the users table
```

### 2. Writing Queries
The MCP server helps you write and execute SQL queries:

Example 1 - Basic SELECT:
```
Help me write a query to get all active users
```
The server will help construct:
```sql
SELECT * FROM users WHERE status = 'active';
```

Example 2 - Joins:
```
Show me users and their profiles
```
The server will help construct:
```sql
SELECT u.*, p.*
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id;
```

### 3. Schema Understanding
The server understands relationships and can help with complex queries:
```
What tables are related to orders?
```
It will analyze foreign keys and show related tables.

## Advanced Features

### 1. Query Parameters
Use parameterized queries for better security:
```
Find users who joined after a specific date
```
The server will help construct:
```sql
SELECT * FROM users WHERE joined_date > :start_date;
```

### 2. Schema Exploration
Get detailed information about constraints and relationships:
```
What foreign keys exist in the orders table?
```

### 3. Data Type Help
Get help with proper data types:
```
What data type should I use for storing user preferences?
```

## Security Features

### 1. API Key Usage
Include your API key in requests:
```
Headers:
X-API-Key: your-api-key
X-Client-ID: your-client-id (optional)
```

### 2. Rate Limiting
The server enforces rate limits:
- 100 requests per minute by default
- Configurable via environment variables
- Per-client tracking using X-Client-ID

### 3. Data Masking
Sensitive data is automatically masked:
- Emails: `****@domain.com`
- Phone numbers: `****1234`
- Custom fields can be configured

## Best Practices

1. **Always Use Parameters**
   ```sql
   -- Good
   SELECT * FROM users WHERE id = :user_id;
   
   -- Avoid
   SELECT * FROM users WHERE id = '123';
   ```

2. **Limit Result Sets**
   ```sql
   SELECT * FROM users
   LIMIT 100 OFFSET :page_offset;
   ```

3. **Use Specific Columns**
   ```sql
   -- Good
   SELECT id, name, email FROM users;
   
   -- Avoid
   SELECT * FROM users;
   ```

## Tips and Tricks

1. **Schema Understanding**
   - Ask about relationships between tables
   - Explore foreign key constraints
   - Check column data types

2. **Query Optimization**
   - Ask for query performance tips
   - Get help with indexing suggestions
   - Understand query execution plans

3. **Error Handling**
   - Get explanations for error messages
   - Receive suggestions for fixes
   - Understand constraint violations

## Common Workflows

1. **Data Exploration**
   ```
   What tables contain user data?
   Show me the structure of the users table
   What relations exist between users and orders?
   ```

2. **Query Building**
   ```
   Help me write a query to find:
   - Latest orders for each user
   - Users who haven't placed orders
   - Most popular products
   ```

3. **Schema Design**
   ```
   What's the best way to structure:
   - User preferences
   - Order history
   - Product categories
   ```