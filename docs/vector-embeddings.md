🧠 Claude Code Instruction: Long-Term Memory via memories Collection

Goal: Recall relevant past memories before generating a response, using embeddings stored in memories. Do not embed raw chat messages — only embed semantic summaries of memories.

1. Memory Schema (existing + new embedding & lifecycle fields)
{
  "collectionId": "ks4rtb8bn45r6a5",
  "collectionName": "memories",
  "id": "test",
  "user": "RELATION_RECORD_ID",
  "confidence": "speculative",
  "type": "core_identity",         // hierarchical: core_identity, patterns, preferences, episodic, contextual
  "priority": 1.0,                 // memory importance weight (1.0 = highest)
  "key": "test",
  "value": "This is the semantic summary of the memory",
  "embedding": "VECTOR(768)",      // new field for pgvector
  "chat_id": "optional_chat_id",   // optional link to the chat that generated it
  "relevance_score": 0.8,         // decays over time
  "access_count": 5,               // track usage frequency
  "last_accessed": "2022-01-01 10:00:00.123Z",  // for LRU cleanup
  "expires_at": "2023-01-01 10:00:00.123Z",     // auto-cleanup date
  "created": "2022-01-01 10:00:00.123Z",
  "updated": "2022-01-01 10:00:00.123Z"
}

2. Creating a Memory

Whenever a memory is generated (e.g., after analysis, pattern detection):

Generate a summary for the memory (value field).

Check for similar existing memories to prevent duplication.

Generate an embedding for the summary using Gemini embeddings (text-embedding-004).

Store with appropriate priority and expiry based on memory type.

Pseudo-code:

const summary = "User tends to feel ignored in meetings";
const embedding = await embedText(summary);

// Check for duplicates
const existingMemory = await findSimilarMemory(embedding, userId, 0.9);
if (existingMemory) {
  // Merge or update existing memory instead
  await mergeMemories(existingMemory, summary);
  return;
}

const memoryType = classifyMemoryType(summary); // core_identity, patterns, etc.
const priority = getMemoryPriority(memoryType);
const expiryDate = getExpiryDate(memoryType);

await pocketbase.collections("memories").create({
  user: userId,
  type: memoryType,
  priority: priority,
  value: summary,
  embedding: embedding,
  relevance_score: 1.0,
  access_count: 0,
  expires_at: expiryDate,
  chat_id: chatId || null
});

3. Retrieving Relevant Memories on User Message

Embed the incoming user message using the same embedding model.

Multi-stage retrieval with hierarchical filtering and temporal weighting.

Update access tracking for retrieved memories.

Pseudo-code:

const messageEmbedding = await embedText(userMessage);

// Stage 1: Vector similarity with priority weighting
const candidateMemories = await pg.query(
  `SELECT id, value, chat_id, type, priority, relevance_score, access_count, last_accessed
   FROM memories 
   WHERE user_id = $1 AND expires_at > NOW()
   ORDER BY (embedding <-> $2) * (2.0 - priority) ASC  -- Higher priority = lower distance
   LIMIT $3`,
  [userId, messageEmbedding, topK * 2]
);

// Stage 2: Filter by memory type hierarchy and recency
const relevantMemories = candidateMemories
  .filter(memory => memory.relevance_score > 0.3) // Quality threshold
  .slice(0, topK); // Final selection

// Stage 3: Update access tracking
for (const memory of relevantMemories) {
  await updateMemoryAccess(memory.id);
}

4. Inject Memories into AI Prompt

Prepend the retrieved memories as system context before sending to Gemini/Claude.

Order memories by importance and include type-specific context.

Example system prompt:

Relevant past memories about this user:
- [Core Identity] User prefers gentle reminders over direct confrontation
- [Pattern] User tends to feel ignored in meetings (mentioned 5 times)
- [Preference] Dislikes being rushed in decision-making
- [Recent Context] Currently dealing with work stress

User: {current_message}
Assistant:

5. Integration Flow per Message

User sends message

Embed message → multi-stage memory retrieval → update access tracking

Inject hierarchical memories into system message

Append short-term chat history if needed

Send to Gemini/Claude for response

Optionally extract new memories (async/batched)

6. Memory Consolidation & Maintenance

Background jobs for memory lifecycle management:

// Daily consolidation job
async consolidateMemories(userId) {
  // Merge similar memories
  await mergeSimilarMemories(userId, similarityThreshold: 0.85);
  
  // Decay relevance scores over time
  await decayMemoryRelevance(userId);
  
  // Promote frequently accessed patterns to core_identity
  await promoteHighValueMemories(userId);
  
  // Archive or delete expired memories
  await cleanupExpiredMemories(userId);
}

// Memory type hierarchy and expiry rules
const MEMORY_CONFIG = {
  core_identity: { priority: 1.0, expiryDays: null },      // Never expires
  patterns: { priority: 0.8, expiryDays: 365 },           // 1 year
  preferences: { priority: 0.6, expiryDays: 180 },        // 6 months
  episodic: { priority: 0.4, expiryDays: 90 },            // 3 months
  contextual: { priority: 0.2, expiryDays: 30 }           // 1 month
};

7. Privacy & User Control

// User memory management endpoints
- GET /memories - View all memories with editing capability
- PUT /memories/:id - Edit memory content
- DELETE /memories/:id - Delete specific memory
- POST /memories/forget - Bulk forget memories by topic
- GET /memories/export - Export all memories for data portability

✅ Key Improvements

Hierarchical memory types with different priorities and expiry rules

Deduplication and merging to prevent memory pollution  

Access tracking and relevance decay for natural memory aging

Multi-stage retrieval for better relevance and performance

Background consolidation jobs for memory lifecycle management

User control over memories with editing and forgetting capabilities

Quality thresholds to prevent low-value memories from persisting

This creates a living memory system that evolves and improves over time, mimicking human memory patterns while maintaining user privacy and control.