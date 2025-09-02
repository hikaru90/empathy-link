/**
 * Core encryption utilities for chat message content
 * 
 * Uses AES-256-CBC with random IV per message for lightweight obfuscation
 * of sensitive chat data in database storage.
 */

import crypto from 'crypto';
import { CHAT_ENCRYPTION_KEY } from '$env/static/private';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // 128-bit IV for AES

/**
 * Get the encryption key from environment variable and derive a proper AES key
 * @throws Error if key is missing or invalid
 */
function getEncryptionKey(): Buffer {
	if (!CHAT_ENCRYPTION_KEY) {
		throw new Error(
			'CHAT_ENCRYPTION_KEY environment variable is required. Use any 4 characters, e.g.: "key1"'
		);
	}
	
	if (CHAT_ENCRYPTION_KEY.length !== 4) {
		throw new Error(
			'CHAT_ENCRYPTION_KEY must be exactly 4 characters. Example: "key1", "pass", "1234"'
		);
	}
	
	// Derive a 32-byte AES key from the 4-character key using SHA-256
	return crypto.createHash('sha256').update(CHAT_ENCRYPTION_KEY).digest();
}

/**
 * Encrypt a text string using AES-256-CBC
 * @param plaintext - The text to encrypt
 * @returns Encrypted data in format: {iv_hex}:{encrypted_hex}
 * @throws Error if encryption fails
 */
export function encryptText(plaintext: string): string {
	try {
		const key = getEncryptionKey();
		const iv = crypto.randomBytes(IV_LENGTH);
		const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
		
		let encrypted = cipher.update(plaintext, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		
		return iv.toString('hex') + ':' + encrypted;
	} catch (error) {
		console.error('Encryption failed:', error instanceof Error ? error.message : 'Unknown error');
		throw new Error('Failed to encrypt text content');
	}
}

/**
 * Decrypt a text string encrypted with encryptText
 * @param encryptedData - The encrypted data in format: {iv_hex}:{encrypted_hex}
 * @returns Original plaintext
 * @throws Error if decryption fails or data is malformed
 */
export function decryptText(encryptedData: string): string {
	try {
		const parts = encryptedData.split(':');
		if (parts.length !== 2) {
			throw new Error('Invalid encrypted data format');
		}
		
		const [ivHex, encryptedHex] = parts;
		const key = getEncryptionKey();
		const iv = Buffer.from(ivHex, 'hex');
		
		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
		
		let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		
		return decrypted;
	} catch (error) {
		console.error('Decryption failed:', error instanceof Error ? error.message : 'Unknown error');
		throw new Error('Failed to decrypt text content');
	}
}

/**
 * Check if a text string appears to be encrypted
 * @param text - Text to check
 * @returns true if text appears to be encrypted
 */
export function isEncrypted(text: string): boolean {
	if (typeof text !== 'string') return false;
	
	// Check format: hex:hex with reasonable length
	const parts = text.split(':');
	if (parts.length !== 2) return false;
	
	const [ivHex, encryptedHex] = parts;
	
	// IV should be 32 hex chars (16 bytes)
	if (ivHex.length !== 32) return false;
	
	// Encrypted content should exist and be hex
	if (encryptedHex.length === 0) return false;
	
	// Both parts should be valid hex
	return /^[0-9a-f]+$/i.test(ivHex) && /^[0-9a-f]+$/i.test(encryptedHex);
}

/**
 * Safely decrypt text, handling both encrypted and unencrypted content
 * @param text - Text that may or may not be encrypted
 * @returns Decrypted text, or original text if not encrypted, or error placeholder if decryption fails
 */
export function safeDecrypt(text: string): string {
	if (!isEncrypted(text)) {
		return text; // Already plaintext
	}
	
	try {
		return decryptText(text);
	} catch (error) {
		console.warn('Failed to decrypt text, returning placeholder:', error instanceof Error ? error.message : 'Unknown error');
		return '[Decryption Error]';
	}
}

/**
 * Safely encrypt text, with fallback behavior
 * @param text - Plaintext to encrypt  
 * @returns Encrypted text, or original text if encryption fails (with warning)
 */
export function safeEncrypt(text: string): string {
	// Don't double-encrypt
	if (isEncrypted(text)) {
		return text;
	}
	
	try {
		return encryptText(text);
	} catch (error) {
		console.warn('Failed to encrypt text, storing as plaintext:', error instanceof Error ? error.message : 'Unknown error');
		return text; // Fallback to plaintext
	}
}