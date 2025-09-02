# Chat History Encryption Specification

## Overview

This document specifies the encryption system for chat history data in the Empathy Link application. The goal is to make sensitive user conversations non-human-readable when stored in the database while maintaining performance for server-side operations.

## Requirements

### Security Requirements
- Chat message content must not be human-readable in database storage
- Encryption must be reversible for server-side processing (Gemini API calls, analytics)
- System must protect against casual database access and data breaches
- No user-specific keys (to allow bulk server operations)

### Performance Requirements
- Minimal computational overhead for encryption/decryption
- Fast bulk operations for server-side processing
- No significant impact on API response times
- Lightweight implementation suitable for high-frequency operations

### Functional Requirements
- Encrypt all chat history `parts.text` content before database storage
- Decrypt chat history when loading for client display
- Decrypt chat history when sending to Gemini API
- Maintain backwards compatibility with existing unencrypted data
- Graceful handling of encryption/decryption failures

## Technical Specification

### Encryption Algorithm
- **Algorithm**: AES-256-CBC
- **Key**: Single static 256-bit key stored in environment variable
- **IV**: Random 128-bit initialization vector per message
- **Format**: `{iv_hex}:{encrypted_content_hex}`

### Key Management
- **Environment Variable**: `CHAT_ENCRYPTION_KEY`
- **Format**: 4-character simple string (any characters)
- **Examples**: `"key1"`, `"pass"`, `"1234"`, `"abcd"`
- **Key Derivation**: SHA-256 hash of 4-char key → 32-byte AES key
- **Storage**: Server environment only, never client-side

### Data Format

#### Unencrypted Message (before encryption)
```json
{
  "role": "user",
  "parts": [{"text": "I feel frustrated with my partner"}],
  "timestamp": 1234567890
}
```

#### Encrypted Message (stored in database)
```json
{
  "role": "user", 
  "parts": [{"text": "a1b2c3d4e5f6...:{encrypted_content}"}],
  "timestamp": 1234567890
}
```

### Implementation Architecture

#### Encryption Layer
```
Client Input → Encryption → Database Storage
             ↓
Database Storage → Decryption → Server Processing (Gemini API)
             ↓  
Database Storage → Decryption → Client Display
```

#### File Structure
```
src/lib/utils/
├── encryption.ts          # Core encryption utilities
└── chatEncryption.ts     # Chat-specific encryption helpers
```

### Affected Data Structures

#### Chat History Object
```typescript
interface HistoryEntry {
  role: 'user' | 'model';
  parts: { text: string }[];  // text field is encrypted
  timestamp: number;
  hidden?: boolean;
  pathMarker?: PathMarker;
}
```

Only the `parts[].text` field is encrypted. All other metadata remains plaintext for database querying.

## Implementation Details

### Core Functions

#### `encryptText(plaintext: string): string`
- Generates random IV
- Encrypts using AES-256-CBC
- Returns `{iv}:{ciphertext}` format

#### `decryptText(encryptedData: string): string`
- Parses IV and ciphertext
- Decrypts using AES-256-CBC
- Returns original plaintext
- Handles malformed input gracefully

#### `encryptChatHistory(history: HistoryEntry[]): HistoryEntry[]`
- Batch encrypts all text content in chat history
- Preserves all metadata and structure
- Handles mixed encrypted/unencrypted data

#### `decryptChatHistory(history: HistoryEntry[]): HistoryEntry[]`
- Batch decrypts all text content in chat history
- Gracefully handles already-decrypted content
- Preserves all metadata and structure

### Integration Points

#### Database Operations
- **Create Chat**: Encrypt history before `pb.collection('chats').create()`
- **Update Chat**: Encrypt history before `pb.collection('chats').update()`
- **Read Chat**: Decrypt history after `pb.collection('chats').getOne()`

#### API Operations
- **Gemini API**: Decrypt history before sending to AI
- **Client Response**: Decrypt history before sending to frontend
- **Analysis**: Decrypt history before chat analysis

### Backwards Compatibility

#### Detection Strategy
```typescript
function isEncrypted(text: string): boolean {
  return text.includes(':') && text.length > 32 && /^[0-9a-f]+:[0-9a-f]+$/.test(text);
}
```

#### Migration Strategy
- New messages: Automatically encrypted
- Existing messages: Remain unencrypted until next update
- Mixed mode: Detect and handle both formats
- No forced migration required

### Error Handling

#### Encryption Failures
- Log error details (without exposing content)
- Fall back to storing unencrypted with warning
- Continue operation to prevent data loss

#### Decryption Failures
- Log error with message ID for debugging
- Return placeholder text: `[Decryption Error]`
- Continue processing other messages
- Alert administrators of potential key issues

#### Key Missing/Invalid
- Application startup fails with clear error message
- Provide key generation instructions
- No fallback to unencrypted mode

## Security Considerations

### Threat Model
**Protected Against:**
- Casual database access
- Database backups exposure
- Basic data breach scenarios

**NOT Protected Against:**
- Server compromise (key is on server)
- Determined attackers with server access
- Side-channel attacks
- Cryptographic analysis (static key, no salt)

### Key Security
- Environment variable only (never hardcoded)
- No key rotation mechanism (static key)
- Server memory contains key during operation
- Database never contains encryption key

## Performance Impact

### Expected Overhead
- **Encryption**: ~0.1ms per message
- **Decryption**: ~0.1ms per message
- **Memory**: Negligible increase
- **Storage**: ~33% increase (hex encoding + IV)

### Optimization Considerations
- Batch operations for multiple messages
- Lazy decryption (only when needed)
- Caching of frequently accessed decrypted content
- Consider streaming for large chat histories

## Testing Strategy

### Unit Tests
- Encryption/decryption round-trip accuracy
- Backwards compatibility with unencrypted data
- Error handling for malformed input
- Performance benchmarks

### Integration Tests
- Full chat creation/retrieval cycle
- Gemini API integration with decrypted data
- Client display of decrypted content
- Mixed encrypted/unencrypted chat handling

### Security Tests
- Verify database storage is non-human-readable
- Confirm no plaintext leakage in logs
- Validate key isolation from client

## Deployment

### Environment Setup
```bash
# Set a simple 4-character encryption key
CHAT_ENCRYPTION_KEY="key1"

# Add to .env
echo "CHAT_ENCRYPTION_KEY=key1" >> .env
```

### Rollout Strategy
1. Deploy encryption utilities (no behavior change)
2. Enable encryption for new chats only
3. Monitor performance and error rates
4. Consider background migration of existing data

## Monitoring & Maintenance

### Metrics to Track
- Encryption/decryption error rates
- Performance impact on API response times
- Storage size increase
- Failed decryption attempts

### Log Messages
- Encryption failures (no content logging)
- Decryption failures with message IDs
- Performance anomalies
- Key-related errors

### Maintenance Tasks
- Regular backup verification
- Performance monitoring
- Security audit of key management
- Consider key rotation strategy for future

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-13  
**Next Review**: 2025-04-13