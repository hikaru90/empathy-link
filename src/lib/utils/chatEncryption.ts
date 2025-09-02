/**
 * Chat-specific encryption utilities
 * 
 * Handles encryption/decryption of chat history objects while preserving
 * metadata and structure for database operations.
 */

import { safeEncrypt, safeDecrypt, isEncrypted } from './encryption.js';

// Type definitions for chat history
export interface HistoryEntry {
	role: 'user' | 'model';
	parts: { text: string }[];
	timestamp: number;
	hidden?: boolean;
	pathMarker?: any;
}

export interface ChatSession {
	user: string;
	module: string;
	history: HistoryEntry[];
}

/**
 * Encrypt all text content in a single history entry
 * @param entry - Chat history entry to encrypt
 * @returns New entry with encrypted text content
 */
export function encryptHistoryEntry(entry: HistoryEntry): HistoryEntry {
	return {
		...entry,
		parts: entry.parts.map(part => ({
			...part,
			text: safeEncrypt(part.text)
		}))
	};
}

/**
 * Decrypt all text content in a single history entry
 * @param entry - Chat history entry to decrypt
 * @returns New entry with decrypted text content
 */
export function decryptHistoryEntry(entry: HistoryEntry): HistoryEntry {
	return {
		...entry,
		parts: entry.parts.map(part => ({
			...part,
			text: safeDecrypt(part.text)
		}))
	};
}

/**
 * Encrypt all text content in chat history array
 * @param history - Array of chat history entries
 * @returns New array with all text content encrypted
 */
export function encryptChatHistory(history: HistoryEntry[]): HistoryEntry[] {
	if (!Array.isArray(history)) {
		console.warn('encryptChatHistory: invalid history format, returning empty array');
		return [];
	}
	
	return history.map(entry => encryptHistoryEntry(entry));
}

/**
 * Decrypt all text content in chat history array
 * @param history - Array of chat history entries (potentially encrypted)
 * @returns New array with all text content decrypted
 */
export function decryptChatHistory(history: HistoryEntry[]): HistoryEntry[] {
	if (!Array.isArray(history)) {
		console.warn('decryptChatHistory: invalid history format, returning empty array');
		return [];
	}
	
	return history.map(entry => decryptHistoryEntry(entry));
}

/**
 * Encrypt a complete chat session object
 * @param chatSession - Chat session to encrypt
 * @returns New chat session with encrypted history
 */
export function encryptChatSession(chatSession: ChatSession): ChatSession {
	return {
		...chatSession,
		history: encryptChatHistory(chatSession.history)
	};
}

/**
 * Decrypt a complete chat session object  
 * @param chatSession - Chat session to decrypt
 * @returns New chat session with decrypted history
 */
export function decryptChatSession(chatSession: ChatSession): ChatSession {
	return {
		...chatSession,
		history: decryptChatHistory(chatSession.history)
	};
}

/**
 * Check if a chat history contains any encrypted content
 * @param history - Chat history to check
 * @returns true if any text content appears encrypted
 */
export function hasEncryptedContent(history: HistoryEntry[]): boolean {
	if (!Array.isArray(history)) return false;
	
	return history.some(entry => 
		entry.parts?.some(part => 
			typeof part.text === 'string' && isEncrypted(part.text)
		)
	);
}

/**
 * Get encryption statistics for a chat history
 * @param history - Chat history to analyze
 * @returns Object with encryption statistics
 */
export function getChatEncryptionStats(history: HistoryEntry[]): {
	totalMessages: number;
	encryptedMessages: number;
	unencryptedMessages: number;
	encryptionPercentage: number;
} {
	if (!Array.isArray(history)) {
		return {
			totalMessages: 0,
			encryptedMessages: 0, 
			unencryptedMessages: 0,
			encryptionPercentage: 0
		};
	}
	
	let encryptedCount = 0;
	let totalCount = 0;
	
	history.forEach(entry => {
		if (entry.parts) {
			entry.parts.forEach(part => {
				totalCount++;
				if (typeof part.text === 'string' && isEncrypted(part.text)) {
					encryptedCount++;
				}
			});
		}
	});
	
	return {
		totalMessages: totalCount,
		encryptedMessages: encryptedCount,
		unencryptedMessages: totalCount - encryptedCount,
		encryptionPercentage: totalCount > 0 ? (encryptedCount / totalCount) * 100 : 0
	};
}