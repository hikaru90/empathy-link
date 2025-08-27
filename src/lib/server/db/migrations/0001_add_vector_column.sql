-- Enable pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Convert embedding column from text to vector(768)
ALTER TABLE memories 
ALTER COLUMN embedding TYPE vector(768) 
USING embedding::vector;

-- Add HNSW index for efficient vector similarity search
CREATE INDEX embedding_idx ON memories USING hnsw (embedding vector_cosine_ops);