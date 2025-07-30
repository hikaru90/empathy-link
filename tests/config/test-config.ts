/**
 * Test configuration and constants
 */

export const TEST_CONFIG = {
  // Timeouts
  DEFAULT_TIMEOUT: 10000,
  LONG_TIMEOUT: 30000,
  SHORT_TIMEOUT: 5000,
  
  // API endpoints
  BASE_URL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:8080',
  API_BASE: '/api',
  
  // Test data
  TEST_DELAY: 1000, // Delay between requests to avoid rate limiting
  MAX_RETRIES: 3,
  
  // User test data
  TEST_USER_PREFIX: 'test.playwright',
  TEST_PASSWORD: 'TestPassword123!',
  
  // AI test parameters
  DEFAULT_LOCALE: 'en',
  TEST_MESSAGES: {
    ANXIETY: 'I am feeling very anxious about my upcoming presentation at work',
    RELATIONSHIP: 'I had a disagreement with my partner and feel disconnected',
    STRESS: 'I am overwhelmed with multiple deadlines and responsibilities',
    SELF_REFLECTION: 'I want to understand my emotional patterns better',
    LEARNING: 'Help me learn about managing difficult emotions'
  },
  
  // Expected response patterns
  EXPECTED_RESPONSE_MIN_LENGTH: 10,
  EXPECTED_ANALYSIS_FIELDS: [
    'title',
    'observation', 
    'feelings',
    'needs',
    'sentimentPolarity'
  ],
  
  // Error codes we expect to handle gracefully
  ACCEPTABLE_ERROR_CODES: [400, 401, 404, 429, 500, 502, 503, 504],
  
  // Test environment flags
  SKIP_SLOW_TESTS: process.env.SKIP_SLOW_TESTS === 'true',
  SKIP_INTEGRATION_TESTS: process.env.SKIP_INTEGRATION_TESTS === 'true',
  ENABLE_DEBUG_LOGGING: process.env.DEBUG === 'true',
  
  // Database and external service mocks
  MOCK_AI_RESPONSES: process.env.MOCK_AI_RESPONSES === 'true',
  MOCK_DATABASE: process.env.MOCK_DATABASE === 'true'
} as const;

export const AI_ENDPOINTS = {
  // Bullshift endpoints
  BULLSHIFT: {
    INIT_CHAT: '/ai/bullshift/initChat',
    SEND: '/ai/bullshift/send',
    ANALYZE_CHAT: '/ai/bullshift/analyzeChat',
    EXTRACT_MEMORIES: '/ai/bullshift/extractMemories',
    CLEAR_CHAT: '/ai/bullshift/clearChat',
    FLUSH_MEMORY: '/ai/bullshift/flushMemory',
    CLEANUP: '/ai/bullshift/cleanup'
  },
  
  // Self-empathy endpoints
  SELF_EMPATHY: {
    INIT_CHAT: '/ai/selfempathy/initChat',
    SEND_MESSAGE: '/ai/selfempathy/sendMessage'
  },
  
  // Learning endpoints
  LEARNING: {
    ASK_QUESTION: '/ai/learn/askQuestion',
    FEELINGS_DETECTIVE: '/ai/learn/feelingsDetective',
    NEEDS_DETECTIVE: '/ai/learn/needsDetective',
    NEEDS_RUBIKS_CUBE: '/ai/learn/needsRubiksCube'
  },
  
  // General AI
  GENERAL: {
    CHECK_JUDGEMENT: '/ai/checkForJudgement'
  }
} as const;

export const MOCK_RESPONSES = {
  BULLSHIFT_INIT: {
    chatId: 'mock-chat-id-123',
    chat: { history: [], created: Date.now() }
  },
  
  BULLSHIFT_SEND: {
    response: 'This is a mock AI response for testing purposes',
    timestamp: Date.now()
  },
  
  ANALYSIS: {
    title: 'Test Analysis',
    observation: 'User appears to be experiencing stress',
    feelings: ['anxious', 'overwhelmed'],
    needs: ['support', 'understanding'],
    sentimentPolarity: -0.3,
    intensityRatio: 0.7,
    emotionalBalance: 0.4,
    triggerCount: 2,
    resolutionCount: 1,
    escalationRate: 0.2,
    empathyRate: 0.8,
    messageLength: 150,
    readabilityScore: 0.6
  },
  
  JUDGEMENT_CHECK: {
    hasJudgement: false,
    explanation: 'No judgmental language detected'
  },
  
  LEARNING_QUESTION: {
    question: 'What emotions are you experiencing right now, and how might they be connected to your current needs?'
  },
  
  DETECTIVE_ANALYSIS: {
    analysis: 'The user seems to be experiencing anxiety and stress, which are natural responses to challenging situations.'
  }
} as const;

/**
 * Get test user email with timestamp to ensure uniqueness
 */
export function getTestUserEmail(suffix = ''): string {
  const timestamp = Date.now();
  return `${TEST_CONFIG.TEST_USER_PREFIX}.${timestamp}${suffix}@example.com`;
}

/**
 * Check if we should skip slow tests
 */
export function shouldSkipSlowTests(): boolean {
  return TEST_CONFIG.SKIP_SLOW_TESTS;
}

/**
 * Check if we should skip integration tests
 */
export function shouldSkipIntegrationTests(): boolean {
  return TEST_CONFIG.SKIP_INTEGRATION_TESTS;
}

/**
 * Log debug information if enabled
 */
export function debugLog(message: string, data?: any): void {
  if (TEST_CONFIG.ENABLE_DEBUG_LOGGING) {
    console.log(`[TEST DEBUG] ${message}`, data || '');
  }
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}