/**
 * Hybrid Memory System
 * 
 * This module integrates the new PostgreSQL vector-based memory system
 * with the existing PocketBase memories collection, providing a seamless
 * transition and backward compatibility.
 */

import { pb } from '$scripts/pocketbase';
import { 
	createMemory, 
	retrieveRelevantMemories, 
	formatMemoriesForPrompt,
	type Memory as VectorMemory
} from './memory.js';

// PocketBase memory interface (existing)
interface PBMemory {
	id: string;
	user: string;
	type: string;
	key?: string;
	value: string;
	confidence: string;
	created: string;
	updated: string;
}

/**
 * Create memory in both systems (migration strategy)
 */
export async function createHybridMemory(
	userId: string,
	summary: string,
	aspectType: string,
	key?: string,
	confidence: string = 'medium',
	chatId?: string
): Promise<void> {
	try {
		// Create in PocketBase (existing system)
		await pb.collection('memories').create({
			user: userId,
			type: aspectType,
			key: key || '',
			value: summary,
			confidence: confidence
		});

		// Create in PostgreSQL vector system (new system)
		await createMemory(userId, summary, chatId, confidence);
		
		console.log('Memory created in both systems');
	} catch (error) {
		console.error('Error creating hybrid memory:', error);
		
		// Fallback: ensure at least PocketBase memory is created
		try {
			await pb.collection('memories').create({
				user: userId,
				type: aspectType,
				key: key || '',
				value: summary,
				confidence: confidence
			});
		} catch (pbError) {
			console.error('Failed to create fallback PocketBase memory:', pbError);
			throw pbError;
		}
	}
}

/**
 * Retrieve memories using vector search with PocketBase fallback
 */
export async function getRelevantMemories(
	userId: string, 
	userMessage: string, 
	topK: number = 5
): Promise<string> {
	try {
		// Try vector-based retrieval first
		const vectorMemories = await retrieveRelevantMemories(userId, userMessage, topK);
		
		if (vectorMemories.length > 0) {
			return formatMemoriesForPrompt(vectorMemories);
		}
		
		// Fallback to PocketBase memories
		console.log('Falling back to PocketBase memories');
		return await getPocketBaseMemories(userId);
		
	} catch (error) {
		console.error('Error retrieving vector memories, falling back to PocketBase:', error);
		return await getPocketBaseMemories(userId);
	}
}

/**
 * Get memories from PocketBase (fallback/existing system)
 */
async function getPocketBaseMemories(userId: string): Promise<string> {
	try {
		const memories = await pb.collection('memories').getFullList({
			filter: `user = "${userId}"`,
			sort: '-created'
		}) as PBMemory[];

		if (memories.length === 0) {
			return '';
		}

		const memoryContext = memories.map(memory => {
			const type = memory.type.toUpperCase();
			return `- [${type}] ${memory.value}`;
		});

		return `Relevant past memories about this user:\n${memoryContext.join('\n')}\n`;
	} catch (error) {
		console.error('Error fetching PocketBase memories:', error);
		return '';
	}
}

/**
 * Migrate existing PocketBase memories to PostgreSQL vector system
 */
export async function migratePocketBaseMemories(userId: string): Promise<void> {
	try {
		const pbMemories = await pb.collection('memories').getFullList({
			filter: `user = "${userId}"`,
			sort: 'created'
		}) as PBMemory[];

		console.log(`Migrating ${pbMemories.length} memories for user ${userId}`);

		for (const pbMemory of pbMemories) {
			try {
				// Create equivalent vector memory
				await createMemory(
					userId,
					pbMemory.value,
					undefined, // No chatId for migrated memories
					pbMemory.confidence
				);
				
				await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
			} catch (error) {
				console.error(`Failed to migrate memory ${pbMemory.id}:`, error);
			}
		}

		console.log(`Migration completed for user ${userId}`);
	} catch (error) {
		console.error('Error during memory migration:', error);
		throw error;
	}
}

/**
 * Check if user has vector memories (to determine which system to use)
 */
export async function hasVectorMemories(userId: string): Promise<boolean> {
	try {
		const vectorMemories = await retrieveRelevantMemories(userId, 'test query', 1);
		return vectorMemories.length > 0;
	} catch (error) {
		return false;
	}
}