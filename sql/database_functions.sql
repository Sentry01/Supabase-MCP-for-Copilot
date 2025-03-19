-- Function to get full database schema information
CREATE OR REPLACE FUNCTION public.get_schema_information()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'tables', (
        SELECT jsonb_agg(table_info)
        FROM (
          SELECT
            t.table_name,
            t.table_type,
            obj_description((quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass) as description,
            (
              SELECT jsonb_agg(
                jsonb_build_object(
                  'column_name', c.column_name,
                  'data_type', c.data_type,
                  'is_nullable', c.is_nullable,
                  'column_default', c.column_default,
                  'description', col_description((quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass, c.ordinal_position)
                )
              )
              FROM information_schema.columns c
              WHERE c.table_schema = t.table_schema
              AND c.table_name = t.table_name
            ) as columns,
            (
              SELECT jsonb_agg(
                jsonb_build_object(
                  'constraint_name', tc.constraint_name,
                  'constraint_type', tc.constraint_type,
                  'column_name', kcu.column_name,
                  'foreign_table_name', ccu.table_name,
                  'foreign_column_name', ccu.column_name
                )
              )
              FROM information_schema.table_constraints tc
              JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
              LEFT JOIN information_schema.constraint_column_usage ccu
                ON tc.constraint_name = ccu.constraint_name
              WHERE tc.table_schema = t.table_schema
              AND tc.table_name = t.table_name
            ) as constraints
          FROM information_schema.tables t
          WHERE t.table_schema = 'public'
        ) table_info
      )
    )
  );
END;
$$;

-- Function to get detailed information about a specific table
CREATE OR REPLACE FUNCTION public.get_table_information(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'table_name', t.table_name,
      'table_type', t.table_type,
      'description', obj_description((quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass),
      'columns', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'column_name', c.column_name,
            'data_type', c.data_type,
            'is_nullable', c.is_nullable,
            'column_default', c.column_default,
            'description', col_description((quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass, c.ordinal_position)
          )
        )
        FROM information_schema.columns c
        WHERE c.table_schema = t.table_schema
        AND c.table_name = t.table_name
      ),
      'constraints', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'constraint_name', tc.constraint_name,
            'constraint_type', tc.constraint_type,
            'column_name', kcu.column_name,
            'foreign_table_name', ccu.table_name,
            'foreign_column_name', ccu.column_name
          )
        )
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_schema = t.table_schema
        AND tc.table_name = t.table_name
      ),
      'row_count', (
        SELECT reltuples::bigint AS estimate
        FROM pg_class
        WHERE oid = (quote_ident(t.table_schema) || '.' || quote_ident(t.table_name))::regclass
      )
    )
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
    AND t.table_name = $1
  );
END;
$$;

-- Function to safely execute parameterized queries
CREATE OR REPLACE FUNCTION public.execute_query(query_string text, query_params jsonb DEFAULT '{}'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  query_type text;
  allowed_query_types text[] := ARRAY['SELECT'];
  sanitized_query text;
BEGIN
  -- Extract query type
  query_type := upper(split_part(trim(query_string), ' ', 1));
  
  -- Validate query type
  IF NOT query_type = ANY(allowed_query_types) THEN
    RAISE EXCEPTION 'Query type % not allowed. Allowed types: %', query_type, array_to_string(allowed_query_types, ', ');
  END IF;

  -- Basic SQL injection prevention
  IF query_string ~* ';|\-\-|/\*|\*/|xp_cmdshell|EXECUTE|EXEC|INTO\s+OUTFILE|INTO\s+DUMPFILE' THEN
    RAISE EXCEPTION 'Query contains potentially dangerous patterns';
  END IF;

  -- Execute query with parameters
  EXECUTE format('SELECT jsonb_agg(row_to_json(t)) FROM (%s) t', query_string)
  INTO result
  USING query_params;

  RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Query execution failed: %', SQLERRM;
END;
$$;