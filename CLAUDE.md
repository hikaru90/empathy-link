# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Basic Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type checking
npm run check
npm run check:watch

# Code formatting
npm run lint      # Check formatting
npm run format    # Fix formatting
```

### Internationalization
```bash
# Generate machine translations
npm run machine-translate
```

### Mobile Development
```bash
# Sync with Capacitor
npm run sync

# Open Android Studio
npm run android
```

## Project Architecture

### Core Technology Stack
- **Framework**: SvelteKit with Svelte 5 (runes)
- **Language**: TypeScript
- **Database**: PocketBase (real-time with auth)
- **AI**: Google Gemini for conversational features
- **UI**: Tailwind CSS + Shadcn/UI components
- **Deployment**: Node.js adapter

### Key Architectural Patterns

#### Multi-Module AI System
The application features three distinct AI modules:
- **Selfempathy**: Structured 7-step empathy process
- **Bullshift**: General conversational AI with persistent memory
- **Learning**: Interactive content with AI-powered questions

#### Memory Architecture
- **Persistent Memory**: User conversations stored in PocketBase
- **Context Injection**: Previous memories included in AI prompts
- **Memory Extraction**: Automatic extraction of key insights from chats

#### Authentication Flow
- **PocketBase Integration**: Session-based authentication
- **Route Protection**: Server-side guards in `hooks.server.ts`
- **Token Management**: Automatic refresh and validation

### File Structure Overview

```
src/
├── routes/
│   ├── app/           # Main authenticated application
│   │   ├── auth/      # Login/register pages
│   │   ├── dashboard/ # User dashboard
│   │   ├── fights/    # Conflict resolution module
│   │   └── selfempathy/ # Self-empathy module
│   ├── bullshift/     # AI chat and learning platform
│   │   ├── learn/     # Learning content management
│   │   ├── insights/  # Chat analysis
│   │   ├── memory/    # User memory management
│   │   └── stats/     # Analytics dashboard
│   └── api/           # Server-side API endpoints
├── lib/
│   ├── components/    # Reusable Svelte components
│   ├── server/        # Server-side utilities (AI, tools)
│   ├── stores/        # Client-side state management
│   └── utils/         # Shared utilities
├── store/             # Global Svelte stores
├── scripts/           # Server utilities (PocketBase, Brevo)
└── paraglide/         # Generated i18n files
```

### API Design Patterns

#### Endpoint Structure
- **AI Endpoints**: `/api/ai/[module]/[action]`
- **Authentication**: Middleware-based protection
- **Error Handling**: Consistent error responses logged to PocketBase

#### Common API Patterns
```typescript
// Typical API route structure
import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';

export async function POST({ request, locals }) {
  const user = locals.user;
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Handle request...
}
```

### Database Schema (PocketBase)
Key collections:
- **users**: User profiles and authentication
- **chats**: AI conversation history
- **user_memories**: Extracted conversation insights
- **feelings/needs**: Empathy process data
- **errors**: Application error logging

### Internationalization
- **Base Locale**: German (de) with English (en) support
- **System**: Paraglide for compile-time i18n
- **Messages**: JSON files in `/messages/`
- **Usage**: Import from `$lib/translations.ts`

### Component Architecture

#### UI Component System
- **Base Components**: Shadcn/UI adapted for Svelte
- **Custom Components**: Specialized empathy and chat interfaces
- **Reusable Patterns**: Consistent design system

#### Key Component Patterns
- **Chat Interface**: `BullshiftChat.svelte` - Full-featured chat with memory
- **Learning Components**: Interactive learning blocks with AI integration
- **Form Components**: Multi-step workflows for empathy processes

### Development Guidelines

#### Working with AI Features
- AI system prompts are defined in `src/lib/server/gemini.ts`
- Memory extraction happens automatically after each chat
- Each AI module has separate context and behavior

#### State Management
- Use Svelte stores for global state (`/src/store/`)
- Authentication state is managed in `auth.ts`
- Chat sessions use `chatStore.ts`

#### Testing
- Playwright for E2E testing
- Test files in `/tests/` directory
- Use `npm run test` to run test suite

#### Building and Deployment
- Production builds use Node.js adapter
- Static assets served from `/static/`
- Environment variables configured through `.env`

### Common Development Tasks

#### Adding New AI Chat Features
1. Create endpoint in `/src/routes/api/ai/[module]/`
2. Add chat interface component
3. Update chat store if needed
4. Test memory persistence

#### Internationalization Updates
1. Add messages to `/messages/de.json` and `/messages/en.json`
2. Use `m.[key]()` function in components
3. Run `npm run machine-translate` for automatic translations

#### UI Component Development
1. Follow existing patterns in `/src/lib/components/ui/`
2. Use Tailwind classes with custom color variables
3. Maintain consistency with design system

### Performance Considerations
- Server-side rendering enabled by default
- Three.js SSR configuration in `vite.config.ts`
- Polling-based file watching for development
- Optimized build process with proper chunking