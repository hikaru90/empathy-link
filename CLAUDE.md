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

### Testing & Automation
```bash
# Run Playwright tests
npm run test

# Run custom authentication isolation test
node test-auth-isolation-playwright.js
```

**Playwright Browser Automation**: 
- Playwright is available for browser automation and testing
- Can create scripts to test authentication, user flows, and security isolation
- Use `import { chromium } from 'playwright'` for browser automation
- Test credentials are available via environment variables `PRIVATE_USERNAME` and `PRIVATE_PASSWORD` for testing login flows
- **SECURITY NOTE**: Test credentials must never be committed to git or exposed in code

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
- Always try to solve the problems you encounter with the most basic design principles. THIS IS REALLY IMPORTANT!!!!
- If there is a browser native solution, use it
- If there is a svelte 5 feature handling this type of problem, use it
- If a problem can be solved by simple props, onMount and functions, use them
- Avoid overcomplex reactivity at all costs!
- When working with db data in a component, follow this pattern: if possible, make sure the db data is passed as a prop from the parent and require it before mounting a component. Is you have to load data in the component itself, define an empty state var, load the data in the onMount block, let the baked in reactivity of svelte 5 change the state var, save it to the db again after manipulation is done through distinctive events 
- If you propose a solution, make no mistakes. Check the logic of the execution logic
- ALWAYS ask yourself if the thing you are implementing could not have been solved more easily


#### Working with AI Features
- AI system prompts are defined in `src/lib/server/gemini.ts`
- Memory extraction happens automatically after each chat
- Each AI module has separate context and behavior

##### Critical Gemini Requirements
**IMPORTANT**: When working with Google Gemini AI chat history:

1. **History must start with user message**: Gemini requires the first message in chat history to have `role: 'user'`
   - Use hidden user messages like `[System: Chat initialisiert]` with `hidden: true` to satisfy this requirement
   - Never filter out these hidden user messages when passing history to Gemini
   - Only filter hidden messages in UI display, not in Gemini initialization

2. **Only user/model roles allowed**: Gemini only accepts `role: 'user'` and `role: 'model'`
   - Never use `role: 'system'` in chat history
   - Path markers and system messages should use `role: 'model'`

3. **Path marker implementation pattern**:
   ```javascript
   // CORRECT: Start with hidden user message, followed by model path marker
   history: [
     {
       role: 'user',
       parts: [{ text: '[System: Chat initialisiert]' }],
       timestamp: Date.now(),
       hidden: true // Hidden from UI but required by Gemini
     },
     {
       role: 'model',
       parts: [{ text: `Pfad gestartet: ${pathId}` }],
       timestamp: Date.now(),
       pathMarker: createPathMarker('path_start', pathId)
     }
   ]
   ```

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

#### Learning Content Editor Development (`/learn/[slug]/edit`)

The learning content editor provides a split-pane interface for editing and previewing learning modules. This section covers critical development considerations for maintaining preview synchronization.

##### Architecture Overview
- **Split-pane Interface**: Left pane shows live preview, right pane shows editor
- **Real-time Preview**: Changes in editor must immediately reflect in preview
- **Dual Preview System**: Both editor preview and user-facing preview must stay synchronized
- **Component-based Content**: Each content block is a standalone component with its own state

##### Critical Development Tasks

###### 1. Preview Synchronization
When modifying any learning component (`src/lib/components/bullshift/Learn/Learn*.svelte`):

**MUST DO**: Ensure both preview contexts are updated
- **Editor Preview**: Left pane of `/learn/[slug]/edit` page
- **User Preview**: Main `/learn/[slug]` page accessed by users
- **Component Props**: Verify `isPreview` prop is handled correctly in all components

**Key Files to Update**:
- Component file: `src/lib/components/bullshift/Learn/Learn[ComponentName].svelte`
- Editor page: `src/routes/bullshift/learn/[slug]/edit/+page.svelte` 
- User page: `src/routes/bullshift/learn/[slug]/+page.svelte`

###### 2. State Management in Previews
- **Editor Preview**: Should show sample/mock data, not save responses
- **User Preview**: Should integrate with learning sessions and save responses
- **Component State**: Use `isPreview` prop to determine behavior
- **Session Integration**: Only user preview should interact with `learningSession` store

###### 3. Multi-step Component Handling
For components with multiple internal steps (like AI questions):
- **Step Registration**: Use `LearnStepComponent` wrapper for step management
- **Navigation**: Provide appropriate navigation in both preview modes
- **Step Indicator**: Ensure `LearnStepIndicator` reflects current step correctly
- **Context Updates**: Update learning context when step changes

###### 4. Data Flow Patterns
```typescript
// Editor preview data flow
onVersionDataChange -> selectedVersionData -> topic() -> components()

// User preview data flow  
server data -> topic() -> components()
```

###### 5. Testing Preview Updates
When making changes to learning components:
1. **Test Editor Preview**: Navigate to `/learn/[slug]/edit` and verify changes appear
2. **Test User Preview**: Navigate to `/learn/[slug]` and verify same changes appear
3. **Test Component Isolation**: Ensure changes don't affect other component types
4. **Test Step Navigation**: For multi-step components, verify navigation works in both contexts
5. **Test Data Persistence**: Ensure user responses are saved (user preview) but not saved (editor preview)

###### 6. Common Issues and Solutions
- **Empty Preview**: Usually caused by missing `isPreview` prop handling
- **Broken Navigation**: Often due to learning context not being updated
- **State Persistence**: Check if component is trying to save data in preview mode
- **Step Indicator Issues**: Verify component step registration is working correctly

##### Best Practices
- Always test both preview contexts when modifying learning components
- Use `isPreview` prop consistently throughout component logic
- Maintain clear separation between preview and live functionality
- Update step indicators when adding multi-step components
- Document any new component-specific preview requirements
- Use global step state computation instead of component-level step logic

##### Critical Design Principle: Visual Consistency Between Preview and Live

**IMPORTANT**: Preview and live components must look and behave identically from a user perspective. The only differences should be internal functionality (saving data, navigation), not visual appearance or available UI elements.

**Why This Matters**:
- Content creators need to see exactly what learners will experience
- Inconsistent previews lead to confusion and poor user experience
- What you see in the editor should match what users see in the actual learning experience

**Implementation Guidelines**:
- **Same UI Elements**: Both preview and live modes should show the same buttons, navigation, and interface elements
- **Consistent Layout**: Identical spacing, positioning, and visual hierarchy
- **Navigation Strategy**: In preview mode, allow back navigation but disable forward navigation to prevent leaving the preview context
- **Sample Data**: Use realistic sample data in preview mode to show how the component will actually look

**Example Pattern**:
```svelte
<!-- GOOD: Same navigation appears in both modes -->
<div class="flex justify-between">
  <!-- Back button - always functional -->
  <Button
    onclick={() => learningContext?.gotoPrevPage()}
    variant="outline"
  >
    Back
  </Button>
  
  <!-- Next button - disabled in preview -->
  <Button
    onclick={() => {
      if (isPreview) return;
      learningContext?.gotoNextPage();
    }}
    disabled={isPreview}
  >
    Next
  </Button>
</div>

<!-- BAD: Different UI between modes -->
{#if !isPreview}
  <div class="navigation">
    <Button onclick={() => learningContext?.gotoPrevPage()}>Back</Button>
    <Button onclick={() => learningContext?.gotoNextPage()}>Next</Button>
  </div>
{:else}
  <div class="preview-note">Preview mode - navigation disabled</div>
{/if}
```

**Key Areas to Maintain Consistency**:
- Navigation buttons (show but disable in preview)
- Form elements (show with sample data)
- Interactive elements (visual feedback without functionality)
- Multi-step components (allow step navigation in preview)
- Error states and loading states (show realistic examples)

#### Global Step State Management

**Architecture**: Step state logic is centralized in the learning context rather than handled by individual components.

**Key Functions**:
- `computeComponentStep(pageIndex, blockIndex, componentType, session)`: Determines which step a component should display based on learning state
- `getComponentStepState(pageIndex, blockIndex)`: Retrieves stored step state for a component
- `setComponentStepState(pageIndex, blockIndex, stepState)`: Updates step state for a component

**Benefits**:
- Consistent step logic across all components
- Easier to maintain and debug step-related issues
- Centralized state management prevents step desynchronization
- Components focus on rendering, not step computation

**Implementation Pattern**:
```typescript
// In component:
const computedStep = learningContext?.computeComponentStep?.(pageIndex, blockIndex, 'aiQuestion', session) || 1;
currentStep = computedStep === 2 ? 'response' : 'question';

// In learning context:
computeComponentStep: (pageIndex, blockIndex, componentType, session) => {
  if (componentType === 'aiQuestion') {
    const response = session?.responses?.find(r => 
      r.pageIndex === pageIndex && r.blockIndex === blockIndex && r.blockType === 'aiQuestion'
    );
    return (response?.response?.userAnswer && response?.response?.aiResponse) ? 2 : 1;
  }
  return 1;
}
```

#### Static Step Calculation Architecture

**CRITICAL REQUIREMENT**: All learning components must use static step calculation determined by the step indicator. Components must NOT recalculate their total step count at runtime.

**Architecture Principles**:
- **Single Source of Truth**: The `LearnStepIndicator` component calculates total steps based on static content structure
- **Static Calculation**: Step counts are determined by component types, not dynamic state
- **No Runtime Modification**: Components cannot modify their `totalSteps` value during execution
- **Consistent Navigation**: Step indicator shows consistent progress bars regardless of which page is mounted

**Step Calculation Rules**:
```typescript
// In LearnStepIndicator.svelte
for (const component of topicData.content) {
  if (component.type === 'aiQuestion') {
    totalComponentSteps += 2; // Question + Response steps
  } else {
    totalComponentSteps += 1; // All other components have 1 step
  }
}
```

**Implementation Requirements**:

1. **LearnStepComponent Usage**:
   ```svelte
   <!-- CORRECT: Static totalSteps value -->
   <LearnStepComponent 
     totalSteps={2}        // Static value based on component type
     currentStep={currentStep}
     let:updateSteps={stepUpdateFn}
   >
   
   <!-- INCORRECT: Dynamic totalSteps calculation -->
   <LearnStepComponent 
     totalSteps={calculateSteps()} // ❌ Never do this
     currentStep={currentStep}
   >
   ```

2. **UpdateSteps Function Signature**:
   ```typescript
   // CORRECT: Only current step parameter
   let updateSteps: ((newCurrentStep: number) => void) | null = null;
   
   // INCORRECT: Total steps parameter
   let updateSteps: ((newCurrentStep: number, newTotalSteps?: number) => void) | null = null; // ❌
   ```

3. **Component Step Management**:
   ```typescript
   // CORRECT: Only update current step
   updateSteps?.(2); // Move to step 2
   
   // INCORRECT: Trying to modify total steps
   updateSteps?.(2, 3); // ❌ Never pass total steps
   ```

**Multi-Step Component Guidelines**:
- **AI Questions**: Always use `totalSteps={2}` (question + response)
- **Single-Step Components**: Always use `totalSteps={1}`
- **Complex Components**: If a component has internal sub-steps, it should still report `totalSteps={1}` to the step indicator and manage internal navigation independently

**Enforcement**:
- Components must not contain `newTotalSteps` parameters
- Components must not dynamically calculate `totalSteps` values
- Components must not call `updateSteps` with more than one parameter
- The `LearnStepComponent` must not allow `totalSteps` modification after initialization

**Benefits**:
- Prevents step indicator from jumping/changing during navigation
- Consistent user experience across all learning modules
- Simplified component logic focused on content, not step counting
- Easier debugging and maintenance of step-related functionality

**Migration Pattern**:
When updating existing components:
1. Remove any `totalSteps` calculations or derived values
2. Set static `totalSteps` value based on component type
3. Remove `newTotalSteps` parameter from `updateSteps` function signatures
4. Remove any `updateSteps` calls that modify total steps
5. Update component to use static step counting

### Performance Considerations
- Server-side rendering enabled by default
- Three.js SSR configuration in `vite.config.ts`
- Polling-based file watching for development
- Optimized build process with proper chunking