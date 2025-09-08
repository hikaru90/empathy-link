# Conversation Quality Testing System

## Overview

This document describes the comprehensive testing system for evaluating AI conversation quality, focusing on user growth, NVC compliance, and conversation effectiveness.

## Authentication Fix

The system now properly authenticates with PocketBase to access database-driven prompts instead of falling back to hardcoded ones.

### Web Interface
- Uses `locals.pb` (authenticated PocketBase instance) from SvelteKit
- Automatically passes user context to test runner
- Displays "🔐 Using authenticated instance: true" when working correctly

### Command Line Interface
- Authenticates using environment variables:
  ```bash
  export ADMIN_EMAIL="your-admin@email.com"
  export ADMIN_PASSWORD="your-admin-password"
  ```
- Falls back to hardcoded prompts if authentication fails
- Shows authentication status in console output

## Architecture

### 1. Single-Turn Tests (Original)
**File**: `conversationTestSuite.ts`
- Tests individual AI responses to specific user inputs
- Good for basic response quality evaluation
- **Problem**: Not comparable if AI responses vary

### 2. Multi-Turn Tests (New Solution)
**Files**: `testUserSimulator.ts`, `multiTurnTestSuite.ts`
- Uses AI-simulated users with consistent personas
- Tests full conversations over multiple turns
- **Solves comparability**: Same persona responds to different AI versions

## Test User Simulation System

### User Personas
Pre-defined realistic personas with:
- **Background**: Life context and situation
- **Emotional State**: Current feelings and mindset
- **Communication Style**: How they typically interact
- **Triggers**: What makes them defensive or resistant
- **Growth Path**: Expected emotional journey
- **Vulnerability Level**: How easily they open up

### Example Personas
```typescript
frustrated_partner: {
  background: "In 3-year relationship, feeling unheard",
  emotionalState: "Frustrated, hurt, some resentment",
  communicationStyle: "defensive",
  triggers: ["Being blamed", "Quick advice", "Minimizing feelings"],
  progressionPath: ["anger", "hurt", "need for respect", "clarity"]
}
```

### Conversation Dynamics
- **Turn-by-turn progression**: User responds based on AI quality
- **Emotional evolution**: State changes based on empathy received
- **Resistance patterns**: Triggers cause predictable defensive responses
- **Growth indicators**: Progress markers track user development

## Evaluation Metrics

### Core Categories
1. **User Growth** (Primary Focus)
   - Self-awareness development
   - Emotional insight building
   - Needs clarity achievement
   - Perspective broadening

2. **NVC Compliance**
   - Observation vs evaluation separation
   - Feelings identification accuracy
   - Needs recognition
   - Requests vs demands framing

3. **Path Switching Quality**
   - Completion signal recognition
   - Appropriate next path suggestions
   - Smooth transition handling

4. **Circular Prevention**
   - Avoiding repeated questions
   - Building on previous insights
   - Conversation progression

5. **Conversation Balance**
   - Question/statement ratio optimization
   - Relevant insight sharing
   - Lecturing avoidance
   - Dialogue maintenance

### Turn-Specific Evaluation
Tests evaluate progress at specific conversation turns:
- **Turn 1**: Basic empathy, avoid judgments
- **Turn 3**: User opening up, needs emerging
- **Turn 6**: Clear progress, path switching readiness
- **Turn 8+**: Natural completion signals

## Comparability Solution

### The Problem
```
User: "Mein Partner nervt mich total"
AI-A: "Das ist frustrierend. Was ist passiert?" → Path A
AI-B: "Ich höre Ärger. Erzähl mehr." → Path B
→ Conversations diverge, no comparison possible!
```

### The Solution
```
User: "Mein Partner nervt mich total" (Alex persona - defensive)
AI-A: "Das ist frustrierend. Was ist passiert?"
→ Alex: "Er macht einfach alles falsch!" (defensive response)
AI-A: "Das klingt wirklich belastend..."
→ Alex: "Ja, ich fühl mich nicht gehört." (softening)

AI-B: "Ich höre Ärger. Erzähl mehr."  
→ Alex: "Er macht einfach alles falsch!" (same defensive response)
AI-B: "Ich verstehe deine Frustration..."
→ Alex: "Endlich versteht mich jemand." (different softening)

→ BOTH can now be compared for user growth facilitation!
```

## Usage

### Web Dashboard
1. Navigate to `/bullshift/backend/quality-tests/`
2. Select test type and parameters
3. Click "Run Tests" 
4. Monitor progress and cancel if needed
5. Export results as JSON

### Command Line
```bash
# Basic tests
node test-conversation-quality.js --type basic

# Category-specific tests
node test-conversation-quality.js --type category --category user_growth

# Single test with verbose output
node test-conversation-quality.js --type single --scenario ug_01_initial_frustration --verbose

# Full test suite with export
node test-conversation-quality.js --type all --export --verbose
```

### Environment Setup
```bash
# For database-driven prompts
export ADMIN_EMAIL="admin@yoursite.com"
export ADMIN_PASSWORD="your-admin-password"

# Custom test server
export TEST_BASE_URL="http://localhost:5173"
```

## Test Scenarios

### Multi-Turn Test Examples

1. **Defensive User Opens Up** (`mt_ug_01_defensive_to_vulnerable`)
   - 14-turn conversation with frustrated partner persona
   - Tests gradual empathy building
   - Measures defensive → vulnerable progression

2. **Judgment Separation** (`mt_nvc_01_observation_vs_evaluation`) 
   - 14-turn conversation with workplace conflict persona
   - Tests consistent NVC observation vs evaluation
   - Measures judgment → factual observation shift

3. **Natural Path Switching** (`mt_ps_01_natural_path_transition`)
   - 14-turn conversation with self-critical persona
   - Tests recognition of conversation completion
   - Measures smooth transition to action planning

## Results and Metrics

### Scoring System
- **0-100 scale** for each metric category
- **Pass/Fail threshold**: 70+ points
- **Turn-specific scoring**: Progress at each conversation stage
- **Overall conversation score**: Weighted average across all metrics

### Comparability Metrics
- **Predictable User Responses**: Did test user behave consistently?
- **Conversation Coherence**: Did the dialogue flow naturally?
- **Repeated Patterns**: Any circular or repetitive behaviors detected?

### Export Format
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "summary": {
    "totalTests": 15,
    "passed": 12,
    "passRate": 80,
    "averageScore": 78.5
  },
  "categoryBreakdown": {
    "user_growth": {"averageScore": 82, "passRate": 85},
    "nvc_compliance": {"averageScore": 75, "passRate": 75}
  },
  "recommendations": [
    "Improve circular prevention - reduce repeated questions",
    "Enhance path switching recognition timing"
  ]
}
```

## Benefits of New System

✅ **Truly Comparable Tests**: Same persona ensures consistent baseline
✅ **Realistic Conversations**: Natural emotional progression over multiple turns  
✅ **Failure Detection**: Catches conversation derailment early
✅ **Progress Validation**: Confirms actual user growth occurred
✅ **Consistency Measurement**: Tracks AI behavior reliability
✅ **Database Integration**: Uses actual prompts, not hardcoded versions

## Future Enhancements

1. **Additional Personas**: More diverse user backgrounds and challenges
2. **Dynamic Scenarios**: AI-generated test scenarios based on patterns
3. **Historical Comparison**: Track prompt improvements over time
4. **A/B Testing Integration**: Compare different prompt versions systematically
5. **Real User Validation**: Correlate test results with actual user feedback