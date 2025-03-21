-- Enable the pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a search function for the documents table
CREATE OR REPLACE FUNCTION match_documents(query_embedding vector(768), match_threshold float, match_count int, category text DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  IF category IS NULL THEN
    RETURN QUERY
    SELECT
      d.id,
      d.content,
      d.metadata,
      1 - (d.embedding <=> query_embedding) AS similarity
    FROM documents d
    WHERE 1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
  ELSE
    RETURN QUERY
    SELECT
      d.id,
      d.content,
      d.metadata,
      1 - (d.embedding <=> query_embedding) AS similarity
    FROM documents d
    WHERE 
      d.metadata->>'category' = category AND
      1 - (d.embedding <=> query_embedding) > match_threshold
    ORDER BY similarity DESC
    LIMIT match_count;
  END IF;
END;
$$;

-- Create an index on the embedding field for faster similarity searches
CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents USING ivfflat (embedding vector_cosine_ops);