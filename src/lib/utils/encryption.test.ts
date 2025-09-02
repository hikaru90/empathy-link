/**
 * Tests for chat encryption utilities
 * 
 * To run: npx vitest src/lib/utils/encryption.test.ts
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { encryptText, decryptText, isEncrypted, safeDecrypt, safeEncrypt } from './encryption.js';
import { encryptChatHistory, decryptChatHistory, hasEncryptedContent, getChatEncryptionStats } from './chatEncryption.js';

// Mock environment variable for testing
beforeAll(() => {
  process.env.CHAT_ENCRYPTION_KEY = 'test';
});

describe('Core Encryption', () => {
  it('should encrypt and decrypt text correctly', () => {
    const plaintext = 'Hello, this is a secret message!';
    const encrypted = encryptText(plaintext);
    const decrypted = decryptText(encrypted);
    
    expect(decrypted).toBe(plaintext);
    expect(encrypted).not.toBe(plaintext);
  });

  it('should produce different ciphertext for same plaintext', () => {
    const plaintext = 'Same message';
    const encrypted1 = encryptText(plaintext);
    const encrypted2 = encryptText(plaintext);
    
    expect(encrypted1).not.toBe(encrypted2); // Different IVs
    expect(decryptText(encrypted1)).toBe(plaintext);
    expect(decryptText(encrypted2)).toBe(plaintext);
  });

  it('should correctly identify encrypted text', () => {
    const plaintext = 'Not encrypted';
    const encrypted = encryptText('Some text');
    
    expect(isEncrypted(plaintext)).toBe(false);
    expect(isEncrypted(encrypted)).toBe(true);
    expect(isEncrypted('invalid:format')).toBe(false);
    expect(isEncrypted('notvalid')).toBe(false);
  });

  it('should safely handle encryption and decryption', () => {
    const plaintext = 'Test message';
    const encrypted = safeEncrypt(plaintext);
    const decrypted = safeDecrypt(encrypted);
    
    expect(decrypted).toBe(plaintext);
    expect(safeDecrypt(plaintext)).toBe(plaintext); // Already plaintext
    expect(safeDecrypt('invalid:data')).toBe('[Decryption Error]');
  });
});

describe('Chat History Encryption', () => {
  const sampleHistory = [
    {
      role: 'user' as const,
      parts: [{ text: 'I feel frustrated with my partner' }],
      timestamp: 1234567890
    },
    {
      role: 'model' as const,
      parts: [{ text: 'I understand your frustration. Can you tell me more?' }],
      timestamp: 1234567891,
      hidden: false
    }
  ];

  it('should encrypt and decrypt chat history', () => {
    const encrypted = encryptChatHistory(sampleHistory);
    const decrypted = decryptChatHistory(encrypted);
    
    // Check structure is preserved
    expect(decrypted).toHaveLength(2);
    expect(decrypted[0].role).toBe('user');
    expect(decrypted[0].timestamp).toBe(1234567890);
    expect(decrypted[1].hidden).toBe(false);
    
    // Check content is restored
    expect(decrypted[0].parts[0].text).toBe('I feel frustrated with my partner');
    expect(decrypted[1].parts[0].text).toBe('I understand your frustration. Can you tell me more?');
    
    // Check content is encrypted in storage
    expect(encrypted[0].parts[0].text).not.toBe('I feel frustrated with my partner');
    expect(isEncrypted(encrypted[0].parts[0].text)).toBe(true);
  });

  it('should handle empty or invalid history gracefully', () => {
    expect(encryptChatHistory([])).toEqual([]);
    expect(decryptChatHistory([])).toEqual([]);
    expect(encryptChatHistory(null as any)).toEqual([]);
    expect(decryptChatHistory(undefined as any)).toEqual([]);
  });

  it('should detect encrypted content in history', () => {
    const plainHistory = sampleHistory;
    const encryptedHistory = encryptChatHistory(sampleHistory);
    
    expect(hasEncryptedContent(plainHistory)).toBe(false);
    expect(hasEncryptedContent(encryptedHistory)).toBe(true);
  });

  it('should provide encryption statistics', () => {
    const mixedHistory = [
      ...sampleHistory, // 2 plaintext messages
      ...encryptChatHistory([sampleHistory[0]]) // 1 encrypted message
    ];
    
    const stats = getChatEncryptionStats(mixedHistory);
    expect(stats.totalMessages).toBe(3);
    expect(stats.encryptedMessages).toBe(1);
    expect(stats.unencryptedMessages).toBe(2);
    expect(stats.encryptionPercentage).toBeCloseTo(33.33, 2);
  });

  it('should handle mixed encrypted/unencrypted content', () => {
    const plainHistory = sampleHistory;
    const encryptedHistory = encryptChatHistory(sampleHistory);
    const mixedHistory = [...plainHistory, ...encryptedHistory];
    
    const decrypted = decryptChatHistory(mixedHistory);
    
    // All should be decrypted now
    expect(decrypted).toHaveLength(4);
    expect(decrypted[0].parts[0].text).toBe('I feel frustrated with my partner');
    expect(decrypted[2].parts[0].text).toBe('I feel frustrated with my partner');
  });
});

describe('Error Handling', () => {
  it('should throw error with missing encryption key', () => {
    const originalKey = process.env.CHAT_ENCRYPTION_KEY;
    delete process.env.CHAT_ENCRYPTION_KEY;
    
    expect(() => encryptText('test')).toThrow('CHAT_ENCRYPTION_KEY environment variable is required');
    
    process.env.CHAT_ENCRYPTION_KEY = originalKey;
  });

  it('should throw error with invalid encryption key length', () => {
    const originalKey = process.env.CHAT_ENCRYPTION_KEY;
    process.env.CHAT_ENCRYPTION_KEY = 'toolong';
    
    expect(() => encryptText('test')).toThrow('CHAT_ENCRYPTION_KEY must be exactly 4 characters');
    
    process.env.CHAT_ENCRYPTION_KEY = 'ab'; // Too short
    expect(() => encryptText('test')).toThrow('CHAT_ENCRYPTION_KEY must be exactly 4 characters');
    
    process.env.CHAT_ENCRYPTION_KEY = originalKey;
  });

  it('should handle malformed encrypted data gracefully', () => {
    expect(() => decryptText('invalid')).toThrow('Invalid encrypted data format');
    expect(() => decryptText('invalid:format:too:many')).toThrow('Invalid encrypted data format');
    expect(safeDecrypt('malformed:data')).toBe('[Decryption Error]');
  });
});

describe('Performance', () => {
  it('should encrypt/decrypt reasonably fast', () => {
    const message = 'This is a test message for performance testing. '.repeat(10);
    
    const start = performance.now();
    const encrypted = encryptText(message);
    const decrypted = decryptText(encrypted);
    const end = performance.now();
    
    expect(decrypted).toBe(message);
    expect(end - start).toBeLessThan(50); // Should complete in under 50ms
  });

  it('should handle batch operations efficiently', () => {
    const largeHistory = Array.from({ length: 50 }, (_, i) => ({
      role: 'user' as const,
      parts: [{ text: `Message number ${i} with some content` }],
      timestamp: Date.now() + i
    }));
    
    const start = performance.now();
    const encrypted = encryptChatHistory(largeHistory);
    const decrypted = decryptChatHistory(encrypted);
    const end = performance.now();
    
    expect(decrypted).toHaveLength(50);
    expect(decrypted[49].parts[0].text).toBe('Message number 49 with some content');
    expect(end - start).toBeLessThan(500); // Should complete in under 500ms for 50 messages
  });
});