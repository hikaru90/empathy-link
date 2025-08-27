-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Convert embedding column from text to vector(768)
ALTER TABLE memories 
ALTER COLUMN embedding TYPE vector(768) 
USING CASE 
  WHEN embedding IS NULL THEN NULL 
  ELSE embedding::vector 
END;

-- Add HNSW index for efficient vector similarity search
CREATE INDEX IF NOT EXISTS embedding_idx ON memories USING hnsw (embedding vector_cosine_ops);
