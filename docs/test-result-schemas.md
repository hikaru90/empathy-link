# Test Result Schemas

This document defines the data structures and schemas for all test results in the empathy-link testing system.

## Overview

The testing system supports three types of tests:
- **Multi-Turn Conversation Tests**: Realistic multi-turn conversations with AI-powered user simulation
- **Quality Tests**: Single-turn response quality evaluation  
- **Path Performance Tests**: Evaluation of conversation path navigation

All test results are saved to the `test_runs` PocketBase collection and follow standardized schemas for consistency.

## Database Schema (`test_runs` Collection)

### Required Fields
```typescript
interface TestRun {
  id: string;                    // Auto-generated PocketBase ID
  created: string;               // ISO timestamp
  user: string;                  // User ID who ran the test
  test_type: string;            // "multi_turn" | "quality" | "path_performance"
  total_tests: number;          // Total number of test scenarios executed
  
  // Results Summary
  passed: number;               // Number of tests that passed
  pass_rate: number;            // Percentage (0-100)
  average_score: number;        // Average score across all tests (0-100)
  
  // Conversation Metrics
  total_conversations: number;  // Total conversation count
  unique_paths_used: string[];  // Path IDs used (empty for multi-turn tests)
  path_switching_quality: number; // Path switching score (0 for multi-turn tests)
  
  // Test Configuration
  test_scenarios: string[];     // Array of scenario IDs tested
  debug_mode: boolean;          // Whether debug mode was enabled
  duration_ms: number;          // Test execution time in milliseconds
  
  // Detailed Results
  detailed_results: any[];      // Array of individual test results (schema varies by test type)
}
```

## Multi-Turn Test Result Schema

### API Response Structure
```typescript
interface MultiTurnTestResponse {
  testType: 'single' | 'all';
  
  // Single Test Response
  scenarioId?: string;          // Only for single tests
  scenarioName?: string;        // Only for single tests
  result?: MultiTurnTestResult; // Only for single tests
  
  // All Tests Response  
  results?: MultiTurnTestResult[]; // Only for all tests
  
  // Common Summary
  summary: {
    success?: boolean;           // Only for single tests
    totalTurns?: number;         // Only for single tests
    overallScore?: number;       // Only for single tests
    
    totalTests?: number;         // Only for all tests
    passed?: number;             // Only for all tests
    passRate?: number;           // Only for all tests
    averageScore?: number;       // Only for all tests
    overallAssessment?: string;  // Only for all tests
    
    conversationAnalysis?: ConversationAnalysis;
    keyInsights?: string[];
    criticalIssues?: string[];
    keyStrengths?: string[];     // Only for all tests
    criticalWeaknesses?: string[]; // Only for all tests
    recommendations?: string[];   // Only for all tests
  };
}
```

### Individual Test Result
```typescript
interface MultiTurnTestResult {
  scenarioId: string;           // Test scenario identifier
  scenarioName: string;         // Human-readable scenario name
  passed: boolean;              // Whether test passed overall criteria
  overallScore: number;         // Overall score 0-100
  totalTurns: number;           // Number of conversation turns completed
  
  // Turn-by-turn results
  turnResults: TurnResult[];
  
  // Conversation analysis
  conversationAnalysis: ConversationAnalysis;
  
  // Comparability metrics
  comparabilityMetrics: ComparabilityMetrics;
  
  // Error information (if test failed)
  error?: string;
}
```

### Turn-by-Turn Analysis
```typescript
interface TurnResult {
  turnNumber: number;           // Turn sequence number (1-indexed)
  aiResponse: string;           // AI response text
  userResponse: string;         // Simulated user response text
  
  // Turn evaluation
  turnScore: number;            // Score for this turn (0-100)
  
  // Progress tracking
  progressAchieved: string[];   // Progress milestones reached this turn
  criticalFailures: string[];   // Critical issues identified this turn
  
  // Response analysis
  aiAnalysis: {
    empathyLevel: number;       // 1-10 scale
    judgmentLevel: number;      // 1-10 scale (lower is better)
    questionType: 'open' | 'closed' | 'leading' | 'none';
    reflectsFeeling: boolean;
    progressesConversation: boolean;
    triggersResistance: boolean;
  };
  
  // Context evolution
  emotionalStateChange?: string; // How user's emotional state changed
  resistanceTriggered?: boolean;
}
```

### Conversation Analysis
```typescript
interface ConversationAnalysis {
  userGrowthAchieved: string[];    // Growth milestones reached
  pathProgressionQuality: number;  // Quality of path progression (0-100)
  consistencyScore: number;        // Consistency across turns (0-100)  
  avoidanceCriteriaSuccess: boolean; // Whether critical issues were avoided
  
  // Conversation flow metrics
  conversationCoherence?: number;   // How coherent the conversation was
  emotionalProgression?: string[];  // Emotional journey tracked
  breakthroughMoments?: number[];   // Turn numbers where breakthroughs occurred
}
```

### Comparability Metrics
```typescript
interface ComparabilityMetrics {
  conversationCoherence: number;    // Overall coherence score (0-100)
  responseRelevance: number;        // How relevant responses were (0-100)
  emotionalIntelligence: number;    // EI demonstration score (0-100)
  adaptabilityScore: number;        // How well AI adapted to user (0-100)
}
```

## Test Scenarios

### Available Multi-Turn Scenarios
```typescript
interface MultiTurnTestScenario {
  id: string;                   // Unique identifier
  name: string;                 // Display name
  description: string;          // Scenario description
  category: string;             // Category for grouping
  personaId: string;           // Test persona to use
  maxTurns: number;            // Maximum conversation turns
  targetPath: string;          // Expected conversation path
  
  // Initial setup
  initialMessage: string;       // User's opening message
  
  // Success criteria
  successCriteria: {
    minimumScore: number;       // Required overall score
    requiredProgress: string[]; // Must achieve these milestones
    criticalAvoidance: string[]; // Must avoid these issues
  };
  
  // Evaluation prompts
  evaluationPrompt: string;     // Turn evaluation prompt
  conversationPrompt: string;   // Final conversation analysis prompt
}
```

### Current Test Scenarios
- `mt_ug_01_defensive_to_vulnerable`: Partner relationship conflict
- `mt_ug_02_workplace_boundaries`: Workplace stress and boundaries
- `mt_ug_03_family_dynamics`: Family relationship tensions
- `mt_ug_04_self_criticism`: Self-doubt and inner critic issues

## Test User Personas

### Persona Structure
```typescript
interface TestUserPersona {
  id: string;                   // Unique identifier
  name: string;                 // Display name
  background: string;           // Character background
  emotionalState: string;       // Starting emotional state
  communicationStyle: 'defensive' | 'open' | 'confused' | 'resistant' | 'cooperative';
  coreIssue: string;           // Primary problem area
  goals: string[];             // What they want to achieve
  triggers: string[];          // What makes them defensive/resistant
  progressionPath: string[];   // Expected emotional journey
  vulnerabilityLevel: number;  // 1-10, how easily they open up
}
```

### Available Personas
- `frustrated_partner`: Relationship conflict, defensive style
- `workplace_conflict`: Professional boundaries, resistant style  
- `family_tension`: Family dynamics, confused style
- `self_critical`: Self-doubt, open but anxious style

## Quality Test Schema (Legacy)

### Test Result Structure
```typescript
interface QualityTestResult {
  testScenario: string;         // Scenario identifier
  testInput: string;            // Input message tested
  aiResponse: string;          // AI response received
  score: number;               // Quality score (0-100)
  passed: boolean;             // Whether test passed threshold
  
  // Detailed evaluation
  evaluation: {
    empathy: number;           // Empathy score (0-100)
    accuracy: number;          // Response accuracy (0-100)
    helpfulness: number;       // Helpfulness score (0-100)
    appropriateness: number;   // Appropriateness score (0-100)
  };
  
  reasoning: string;           // Evaluation reasoning
  suggestions: string[];       // Improvement suggestions
}
```

## Path Performance Test Schema (Legacy)

### Test Result Structure  
```typescript
interface PathPerformanceResult {
  testScenario: string;        // Scenario identifier
  pathId: string;             // Path taken
  pathSwitchingQuality: number; // Quality of path transitions (0-100)
  conversationCount: number;   // Number of conversations in path
  averageScore: number;       // Average score across path (0-100)
  uniquePathsUsed: string[];  // All unique paths encountered
  
  // Path analysis
  pathProgression: {
    stagesCompleted: string[]; // Stages successfully completed
    stageScores: Record<string, number>; // Score per stage
    transitionQuality: number; // Quality of stage transitions
  };
}
```

## Usage Examples

### Saving Multi-Turn Test Results
```typescript
// Single conversation test
await saveTestResultsToDatabase('multi_turn', {
  testType: 'single',
  scenarioId: 'mt_ug_01_defensive_to_vulnerable',
  scenarioName: 'Alex - Frustrated Partner',
  result: {
    passed: true,
    overallScore: 87.5,
    totalTurns: 8,
    // ... full result structure
  },
  summary: {
    success: true,
    totalTurns: 8,
    overallScore: 87.5,
    // ... summary data
  }
});

// All conversations test
await saveTestResultsToDatabase('multi_turn', {
  testType: 'all',
  results: [
    // Array of MultiTurnTestResult objects
  ],
  summary: {
    totalTests: 4,
    passed: 3,
    passRate: 75,
    averageScore: 82.3,
    // ... aggregated summary
  }
});
```

### Querying Test Results
```typescript
// Get recent test runs
const testRuns = await pb.collection('test_runs').getList(1, 20, {
  filter: `user = "${userId}"`,
  sort: '-created'
});

// Get multi-turn test results only
const multiTurnTests = await pb.collection('test_runs').getList(1, 10, {
  filter: `user = "${userId}" && test_type = "multi_turn"`,
  sort: '-created'
});
```

## Error Handling

### Test Execution Errors
When tests fail due to execution errors, the result structure includes error information:

```typescript
interface FailedTestResult {
  scenarioId: string;
  scenarioName: string;  
  passed: false;
  overallScore: 0;
  totalTurns: 0;
  turnResults: [];
  conversationAnalysis: {};
  comparabilityMetrics: {};
  error: string;           // Error message describing the failure
}
```

### Common Error Types
- `"Test execution timeout"`: Test exceeded maximum duration
- `"AI response generation failed"`: Gemini API error
- `"User simulation failed"`: User persona simulation error
- `"Evaluation prompt failed"`: Turn evaluation error
- `"Test suite cancelled by user"`: User-initiated cancellation

## Performance Considerations

- Multi-turn tests typically take 30-120 seconds per scenario
- All tests include AbortSignal support for user cancellation
- Test results are automatically saved to database upon completion
- Failed saves don't prevent test completion (error logging only)
- Database saves include error handling and detailed logging

## Data Retention

- Test results are permanently stored in PocketBase
- No automatic cleanup or archival (manual management required)
- Results include full conversation history for analysis
- User privacy: Only authenticated users can access their own test results

---

*Last updated: September 4, 2025*
*System: Multi-turn conversation testing framework v1.0*