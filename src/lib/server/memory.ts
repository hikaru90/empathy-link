import { GoogleGenAI } from '@google/genai';
import { PRIVATE_GEMINI_API_KEY } from '$env/static/private';
import { db } from './db/index.js';
import { memories, type Memory, type NewMemory } from './db/schema.js';
import { sql, desc, and, gte, lt, eq, isNull, or, inArray } from 'drizzle-orm';

// Initialize Gemini client
const genai = new GoogleGenAI({ apiKey: PRIVATE_GEMINI_API_KEY });

// Memory type configuration
export const MEMORY_CONFIG = {
	core_identity: { priority: 1.0, expiryDays: null }, // Never expires
	patterns: { priority: 0.8, expiryDays: 365 }, // 1 year
	preferences: { priority: 0.6, expiryDays: 180 }, // 6 months
	episodic: { priority: 0.4, expiryDays: 90 }, // 3 months
	contextual: { priority: 0.2, expiryDays: 30 } // 1 month
} as const;

export type MemoryType = keyof typeof MEMORY_CONFIG;

/**
 * Generate text embedding using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
	try {
		// Use the official API pattern from Google's docs
		const response = await genai.models.embedContent({
			model: 'text-embedding-004',
			contents: text,
		});
		
		return response.embeddings[0].values;
	} catch (error) {
		console.error('Embedding generation failed:', error);
		console.log('Using realistic random embeddings for testing');
		// Return realistic random embeddings for testing (768 dimensions for text-embedding-004)
		return Array(768).fill(0).map(() => (Math.random() - 0.5) * 2);
	}
}

/**
 * Extract explicit memory requests from user messages
 * Detects phrases like "remember that...", "please remember...", "don't forget that..."
 */
export function extractExplicitMemoryRequest(userMessage: string): string | null {
	const message = userMessage.toLowerCase();
	
	// Patterns for explicit memory requests
	const memoryPatterns = [
		/remember (?:that )?(.+)/i,
		/please remember (?:that )?(.+)/i,
		/don't forget (?:that )?(.+)/i,
		/vergiss nicht,? (?:dass )?(.+)/i, // German: don't forget
		/merk dir,? (?:dass )?(.+)/i, // German: remember
		/behalte (?:im gedächtnis,? )?(?:dass )?(.+)/i, // German: keep in mind
		/notiere dir,? (?:dass )?(.+)/i // German: note that
	];
	
	for (const pattern of memoryPatterns) {
		const match = userMessage.match(pattern);
		if (match && match[1]) {
			// Clean up the extracted memory
			let memory = match[1].trim();
			// Remove trailing punctuation
			memory = memory.replace(/[.!?]+$/, '');
			return memory;
		}
	}
	
	return null;
}

/**
 * Create memory immediately when user explicitly requests it
 */
export async function handleExplicitMemoryRequest(
	userId: string,
	userMessage: string,
	chatId?: string
): Promise<boolean> {
	const explicitMemory = extractExplicitMemoryRequest(userMessage);
	
	if (!explicitMemory) {
		return false; // No explicit memory request found
	}
	
	try {
		console.log(`Explicit memory request detected: "${explicitMemory}"`);
		
		// Create the memory immediately
		await createMemory(
			userId,
			explicitMemory,
			chatId,
			'certain' // High confidence for explicit requests
		);
		
		console.log(`✅ Explicit memory created: ${explicitMemory}`);
		return true;
	} catch (error) {
		console.error('Error creating explicit memory:', error);
		return false;
	}
}

/**
 * Classify memory type based on content
 */
export function classifyMemoryType(summary: string): MemoryType {
	const text = summary.toLowerCase();
	
	// Core identity patterns
	if (text.includes('personality') || text.includes('character') || text.includes('identity') || 
		text.includes('core belief') || text.includes('value') || text.includes('fundamental')) {
		return 'core_identity';
	}
	
	// Pattern recognition
	if (text.includes('pattern') || text.includes('tends to') || text.includes('usually') || 
		text.includes('often') || text.includes('repeatedly') || text.includes('habit')) {
		return 'patterns';
	}
	
	// Preferences
	if (text.includes('prefers') || text.includes('likes') || text.includes('dislikes') || 
		text.includes('enjoys') || text.includes('hates') || text.includes('favorite')) {
		return 'preferences';
	}
	
	// Recent context
	if (text.includes('currently') || text.includes('today') || text.includes('recently') || 
		text.includes('right now') || text.includes('this week')) {
		return 'contextual';
	}
	
	// Default to episodic for specific events
	return 'episodic';
}

/**
 * Get expiry date based on memory type
 */
export function getExpiryDate(memoryType: MemoryType): Date | null {
	const config = MEMORY_CONFIG[memoryType];
	if (config.expiryDays === null) {
		return null; // Never expires
	}
	
	const expiryDate = new Date();
	expiryDate.setDate(expiryDate.getDate() + config.expiryDays);
	return expiryDate;
}

/**
 * Check for similar existing memories to prevent duplication
 */
export async function findSimilarMemory(
	embedding: number[], 
	userId: string, 
	threshold: number = 0.9
): Promise<Memory | null> {
	try {
		const results = await db.execute(sql`
			SELECT * FROM memories 
			WHERE user_id = ${userId} 
			AND (expires_at IS NULL OR expires_at > NOW())
			ORDER BY embedding <-> ${JSON.stringify(embedding)}::vector
			LIMIT 1
		`);
		
		if (results.length === 0) return null;
		
		// Calculate similarity (1 - cosine distance)
		const memory = results[0] as any;
		const similarity = await calculateSimilarity(embedding, memory.embedding);
		
		return similarity >= threshold ? (memory as Memory) : null;
	} catch (error) {
		console.error('Error finding similar memory:', error);
		return null;
	}
}

/**
 * Search for top-k most similar memories for chat context
 */
export async function searchSimilarMemories(
	text: string,
	userId: string,
	k: number = 5
): Promise<Array<Memory & { similarity: number }>> {
	try {
		console.log(`🔍 Searching for ${k} similar memories for user: ${userId}`);
		
		// Generate embedding for the search text
		const embedding = await generateEmbedding(text);
		
		// Search for similar memories using vector similarity
		const results = await db.execute(sql`
			SELECT *, 
				   1 - (embedding <-> ${JSON.stringify(embedding)}::vector) as similarity
			FROM memories 
			WHERE user_id = ${userId} 
			AND (expires_at IS NULL OR expires_at > NOW())
			ORDER BY embedding <-> ${JSON.stringify(embedding)}::vector
			LIMIT ${k}
		`);
		
		console.log(`📝 Found ${results.length} similar memories`);
		console.log('🔍 Memory results structure:', results.map(r => ({ id: (r as any).id, key: (r as any).key, value: (r as any).value })));
		
		// Update access_count and last_accessed for retrieved memories
		const memoryIds = results.map(r => (r as any).id).filter(id => id); // Filter out null/undefined
		console.log('🔍 Memory IDs to update:', memoryIds);
		
		if (memoryIds.length > 0) {
			// Use proper Drizzle ORM update with inArray and correct column names
			await db.update(memories)
				.set({ 
					accessCount: sql`access_count + 1`,
					lastAccessed: new Date()
				})
				.where(inArray(memories.id, memoryIds));
			console.log('✅ Updated access count for retrieved memories');
		}
		
		return results.map(result => {
			const memory = result as any;
			return {
				...memory,
				similarity: memory.similarity || 0
			};
		});
		
	} catch (error) {
		console.error('Error searching similar memories:', error);
		return [];
	}
}

/**
 * Calculate cosine similarity between two embeddings
 */
async function calculateSimilarity(embedding1: number[], embedding2: any): Promise<number> {
	// This would need to be implemented based on how pgvector stores embeddings
	// For now, returning a placeholder value
	return 0.5;
}

/**
 * Merge similar memories
 */
export async function mergeMemories(existingMemory: Memory, newSummary: string): Promise<void> {
	try {
		const mergedValue = `${existingMemory.value}. ${newSummary}`;
		const newEmbedding = await generateEmbedding(mergedValue);
		
		await db.execute(sql`
			UPDATE memories 
			SET 
				value = ${mergedValue},
				embedding = ${JSON.stringify(newEmbedding)}::vector,
				access_count = ${existingMemory.accessCount + 1},
				updated = NOW()
			WHERE id = ${existingMemory.id}
		`);
	} catch (error) {
		console.error('Error merging memories:', error);
		throw error;
	}
}

/**
 * Create a new memory with deduplication
 */
export async function createMemory(
	userId: string,
	summary: string,
	chatId?: string,
	confidence: string = 'medium'
): Promise<Memory | null> {
	try {
		const embedding = await generateEmbedding(summary);
		
		// Check for duplicates
		const existingMemory = await findSimilarMemory(embedding, userId, 0.85);
		if (existingMemory) {
			await mergeMemories(existingMemory, summary);
			return existingMemory;
		}
		
		const memoryType = classifyMemoryType(summary);
		const priority = MEMORY_CONFIG[memoryType].priority;
		const expiryDate = getExpiryDate(memoryType);
		
		const newMemory: NewMemory = {
			userId,
			confidence,
			type: memoryType,
			priority,
			key: '', // Default empty key
			value: summary,
			embedding: JSON.stringify(embedding), // Store as JSON string, will be converted by custom SQL
			chatId: chatId || null,
			relevanceScore: 1.0,
			accessCount: 0,
			expiresAt: expiryDate
		};
		
		// Use raw SQL to insert with proper vector conversion
		const result = await db.execute(sql`
			INSERT INTO memories (
				user_id, confidence, type, priority, key, value, embedding, 
				chat_id, relevance_score, access_count, expires_at
			) VALUES (
				${userId}, ${confidence}, ${memoryType}, ${priority}, '', 
				${summary}, ${JSON.stringify(embedding)}::vector, ${chatId || null}, 
				1.0, 0, ${expiryDate ? expiryDate.toISOString() : null}
			) RETURNING *
		`);
		
		console.log('SQL insert result:', result);
		console.log('Result length:', result.length);
		
		if (!result || result.length === 0) {
			throw new Error('No rows returned from insert query');
		}
		
		return result[0] as Memory;
	} catch (error) {
		console.error('Error creating memory:', error);
		throw error;
	}
}

/**
 * Retrieve relevant memories for a user message
 */
export async function retrieveRelevantMemories(
	userId: string,
	userMessage: string,
	topK: number = 5
): Promise<Memory[]> {
	try {
		const messageEmbedding = await generateEmbedding(userMessage);
		
		// Stage 1: Vector similarity with priority weighting
		const candidateMemories = await db.execute(sql`
			SELECT *, (embedding <-> ${JSON.stringify(messageEmbedding)}::vector) * (2.0 - priority) as weighted_distance
			FROM memories 
			WHERE user_id = ${userId} 
			AND (expires_at IS NULL OR expires_at > NOW())
			ORDER BY weighted_distance ASC
			LIMIT ${topK * 2}
		`);
		
		// Stage 2: Filter by relevance threshold and select final results
		const relevantMemories = candidateMemories.rows
			.filter((memory: any) => memory.relevance_score > 0.3)
			.slice(0, topK) as Memory[];
		
		// Stage 3: Update access tracking
		for (const memory of relevantMemories) {
			await updateMemoryAccess(memory.id);
		}
		
		return relevantMemories;
	} catch (error) {
		console.error('Error retrieving memories:', error);
		return [];
	}
}

/**
 * Update memory access tracking
 */
export async function updateMemoryAccess(memoryId: string): Promise<void> {
	try {
		await db
			.update(memories)
			.set({
				accessCount: sql`access_count + 1`,
				lastAccessed: new Date()
			})
			.where(eq(memories.id, memoryId));
	} catch (error) {
		console.error('Error updating memory access:', error);
	}
}

/**
 * Format memories for AI prompt injection
 */
export function formatMemoriesForPrompt(memories: Memory[]): string {
	if (memories.length === 0) return '';
	
	const formattedMemories = memories
		.sort((a, b) => b.priority - a.priority) // Sort by priority
		.map(memory => {
			const type = memory.type.replace('_', ' ').toUpperCase();
			const accessInfo = memory.accessCount > 1 ? ` (mentioned ${memory.accessCount} times)` : '';
			return `- [${type}] ${memory.value}${accessInfo}`;
		});
	
	return `Relevant past memories about this user:\n${formattedMemories.join('\n')}\n`;
}

/**
 * Daily consolidation job - merge similar memories, decay relevance, cleanup expired
 */
export async function consolidateMemories(userId: string): Promise<void> {
	try {
		// Decay relevance scores over time
		await decayMemoryRelevance(userId);
		
		// Promote frequently accessed patterns to core_identity
		await promoteHighValueMemories(userId);
		
		// Cleanup expired memories
		await cleanupExpiredMemories(userId);
		
		console.log(`Memory consolidation completed for user ${userId}`);
	} catch (error) {
		console.error('Error during memory consolidation:', error);
	}
}

/**
 * Decay memory relevance scores over time
 */
async function decayMemoryRelevance(userId: string): Promise<void> {
	const decayFactor = 0.99; // Small daily decay
	
	await db
		.update(memories)
		.set({
			relevanceScore: sql`relevance_score * ${decayFactor}`,
			updated: new Date()
		})
		.where(and(
			eq(memories.userId, userId),
			gte(memories.relevanceScore, 0.1) // Don't decay below threshold
		));
}

/**
 * Promote frequently accessed memories to higher priority types
 */
async function promoteHighValueMemories(userId: string): Promise<void> {
	// Promote patterns with high access count to core_identity
	const highValuePatterns = await db
		.select()
		.from(memories)
		.where(and(
			eq(memories.userId, userId),
			eq(memories.type, 'patterns'),
			gte(memories.accessCount, 10) // Frequently accessed threshold
		));
	
	for (const memory of highValuePatterns) {
		await db
			.update(memories)
			.set({
				type: 'core_identity',
				priority: 1.0,
				expiresAt: null, // Core identity never expires
				updated: new Date()
			})
			.where(eq(memories.id, memory.id));
	}
}

/**
 * Clean up expired memories
 */
async function cleanupExpiredMemories(userId: string): Promise<void> {
	await db
		.delete(memories)
		.where(and(
			eq(memories.userId, userId),
			lt(memories.expiresAt, new Date())
		));
}