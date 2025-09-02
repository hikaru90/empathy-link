# Database-Driven Prompts System

The empathy-link application now uses a database-driven prompts system that allows server-side prompts to be editable through a PocketBase collection.

## Overview

Previously, all prompts were hardcoded in `src/lib/server/paths.ts`. Now prompts are stored in a PocketBase `prompts` collection and can be edited through an admin interface while maintaining backward compatibility with the existing hardcoded prompts.

## Features

- **Database Storage**: All prompts stored in PocketBase `prompts` collection
- **Shortcode Support**: Prompts can reference other prompts using `[slug]` syntax
- **User Context Integration**: Dynamic prompts based on user preferences (answer length, tone, NVC knowledge)
- **Admin Interface**: Web-based CRUD interface for managing prompts
- **Caching**: 5-minute cache to avoid frequent database calls
- **Backward Compatibility**: Falls back to hardcoded prompts if database fails

## PocketBase Collection Schema

### Collection: `prompts`

| Field | Type | Description |
|-------|------|-------------|
| `id` | text | Auto-generated primary key |
| `slug` | text | Unique identifier (e.g., "idle", "self_empathy") |
| `name` | text | Human-readable name |
| `content` | editor | The prompt content with shortcode support |
| `recurring` | bool | Whether this prompt can be used as a shortcode |
| `category` | select | Type: path, system, preference, rule, other |
| `description` | text | Optional description |
| `active` | bool | Whether the prompt is enabled |
| `path_config` | json | Path-specific config (entry/exit conditions, etc.) |

## Shortcode System

Prompts can reference other prompts using shortcodes like `[answerLengthPreference]`, `[importantRules]`, etc.

### Available Shortcodes:

1. **`[answerLengthPreference]`** - Dynamic length rules based on user's `aiAnswerLength` preference
2. **`[toneOfVoicePreference]`** - Dynamic tone rules based on user's `toneOfVoice` preference  
3. **`[nvcKnowledgePreference]`** - Dynamic NVC complexity rules based on user's `nvcKnowledge` preference
4. **`[importantRules]`** - Core conversation rules (no emojis, no bold, etc.)

## Prompt Categories

### Path Prompts (category: "path")
- `idle` - Main conversation orchestration
- `self_empathy` - Self-empathy using Carl Rogers' approach
- `other_empathy` - Developing empathy for others
- `action_planning` - Creating actionable plans
- `conflict_resolution` - Resolving interpersonal conflicts
- `feedback` - Ending conversations and collecting feedback
- `memory` - Retrieving stored user memories

### System Prompts (category: "rule", recurring: true)
- `importantRules` - Core conversation rules
- `answerLengthPreference` - Dynamic length rules
- `toneOfVoicePreference` - Dynamic tone rules  
- `nvcKnowledgePreference` - Dynamic NVC knowledge rules

## Usage

### Server-Side API

```typescript
import { getSystemPromptForPath, processShortcodes } from '$lib/server/prompts';

// Get a complete prompt with user context and shortcode processing
const prompt = await getSystemPromptForPath('self_empathy', userContext);

// Process shortcodes in any text
const processed = await processShortcodes('[importantRules]', userContext);
```

### Admin Interface

Navigate to `/bullshift/backend/prompts` (requires admin role) to:
- View all prompts organized by category
- Create new prompts
- Edit existing prompts with live preview
- Delete prompts
- Toggle active/inactive status
- Set recurring status for shortcode usage

## Migration Strategy

The system maintains backward compatibility:

1. **Database First**: Always tries to load prompts from database
2. **Fallback**: If database fails, uses hardcoded prompts from `paths.ts`
3. **Gradual Migration**: Can migrate prompts one by one without breaking existing functionality

## Implementation Files

### Core System
- `src/lib/server/prompts.ts` - Main prompt system with database integration
- `src/lib/server/paths.ts` - Updated to use database prompts with fallback

### Admin Interface  
- `src/routes/bullshift/backend/prompts/+page.server.ts` - Server actions
- `src/routes/bullshift/backend/prompts/+page.svelte` - Admin UI

### Updated Files
- `src/routes/bullshift/+page.server.ts` - Uses async prompt loading
- `src/lib/server/gemini.ts` - Uses async prompt loading
- `src/routes/api/ai/bullshift/send/+server.ts` - Uses async prompt loading

## Setting Up the Collection

1. **Create Collection**: Create a `prompts` collection in PocketBase with the schema above
2. **Set Permissions**: 
   - List/View: Authenticated users
   - Create/Update/Delete: Admin users only
3. **Add Initial Data**: Use the admin interface to create the initial prompts

## Benefits

- **Editable Prompts**: No code changes required to update conversation flows
- **A/B Testing**: Easy to test different prompt variations
- **User Customization**: Dynamic prompts based on user preferences
- **Maintainability**: Centralized prompt management
- **Performance**: Cached prompts with efficient database queries
- **Flexibility**: Shortcode system allows prompt composition and reuse