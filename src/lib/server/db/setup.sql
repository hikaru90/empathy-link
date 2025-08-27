-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- This migration will be run by Drizzle, but pgvector needs to be enabled first
-- Run this SQL manually in your PostgreSQL database before running migrations:
-- CREATE EXTENSION IF NOT EXISTS vector;