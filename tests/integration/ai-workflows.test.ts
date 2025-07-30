import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { 
  authenticateUser, 
  makeAuthenticatedRequest,
  initializeBullshiftChat,
  sendBullshiftMessage,
  initializeSelfEmpathyChat,
  TEST_USERS,
  assertApiResponse
} from '../utils/test-helpers';

test.describe('AI Workflow Integration Tests', () => {
  let authenticatedPage: Page;
  
  test.beforeAll(async ({ browser }) => {
    authenticatedPage = await browser.newPage();
    await authenticateUser(authenticatedPage, TEST_USERS.primary);
  });

  test.afterAll(async () => {
    await authenticatedPage.close();
  });

  test.describe('Complete Bullshift Chat Workflow', () => {
    
    test('Should complete full bullshift conversation and analysis workflow', async () => {
      // Step 1: Initialize chat
      const chatId = await initializeBullshiftChat(authenticatedPage);
      expect(chatId).toBeTruthy();
      
      // Step 2: Send multiple messages to build conversation
      const messages = [
        'I am feeling really stressed about my upcoming presentation at work',
        'I keep worrying that I will forget what to say or that people will judge me',
        'This anxiety is affecting my sleep and I feel overwhelmed'
      ];
      
      const responses = [];
      for (const message of messages) {
        const response = await sendBullshiftMessage(authenticatedPage, chatId, message);
        responses.push(response);
        expect(response.response).toBeTruthy();
        expect(typeof response.response).toBe('string');
      }
      
      // Step 3: Analyze the chat
      const analysisResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/bullshift/analyzeChat', {
        chatId,
        locale: 'en'
      });
      
      expect(analysisResponse.status()).toBe(200);
      const analysisData = await analysisResponse.json();
      
      assertApiResponse(analysisData, ['analysis', 'initiatedChat']);
      assertApiResponse(analysisData.analysis, [
        'title', 'observation', 'feelings', 'needs', 'sentimentPolarity'
      ]);
      
      // Verify analysis contains relevant content
      expect(analysisData.analysis.feelings).toBeInstanceOf(Array);
      expect(analysisData.analysis.needs).toBeInstanceOf(Array);
      expect(typeof analysisData.analysis.sentimentPolarity).toBe('number');
      
      // Step 4: Extract memories
      const memoryResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/bullshift/extractMemories', {
        userId: 'test-user-id'
      });
      
      expect(memoryResponse.status()).toBe(200);
      const memoryData = await memoryResponse.json();
      expect(memoryData.success).toBe(true);
      
      // Step 5: Clear chat
      const clearResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/bullshift/clearChat', {
        chatId
      });
      
      expect(clearResponse.status()).toBe(200);
      const clearData = await clearResponse.json();
      expect(clearData.success).toBe(true);
    });

    test('Should handle chat persistence across requests', async () => {
      const chatId = await initializeBullshiftChat(authenticatedPage);
      
      // Send first message
      const firstResponse = await sendBullshiftMessage(
        authenticatedPage, 
        chatId, 
        'Hello, I want to talk about my feelings'
      );
      expect(firstResponse.response).toBeTruthy();
      
      // Send follow-up message that references previous context
      const followUpResponse = await sendBullshiftMessage(
        authenticatedPage, 
        chatId, 
        'Can you help me understand what I just shared?'
      );
      expect(followUpResponse.response).toBeTruthy();
      
      // The AI should have context from the previous message
      expect(followUpResponse.response.length).toBeGreaterThan(10);
    });
  });

  test.describe('Complete Self-Empathy Workflow', () => {
    
    test('Should complete self-empathy conversation workflow', async () => {
      // Step 1: Initialize self-empathy chat
      const chatId = await initializeSelfEmpathyChat(authenticatedPage);
      expect(chatId).toBeTruthy();
      
      // Step 2: Send message about personal struggle
      const messageResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/selfempathy/sendMessage', {
        chatId,
        message: 'I had a conflict with my partner and I feel terrible about it',
        history: []
      });
      
      expect(messageResponse.status()).toBe(200);
      const messageData = await messageResponse.json();
      expect(messageData.response).toBeTruthy();
      
      // Step 3: Continue conversation with follow-up
      const followUpResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/selfempathy/sendMessage', {
        chatId,
        message: 'I think I was being defensive and not listening properly',
        history: [
          {
            role: 'user',
            parts: [{ text: 'I had a conflict with my partner and I feel terrible about it' }]
          },
          {
            role: 'model', 
            parts: [{ text: messageData.response }]
          }
        ]
      });
      
      expect(followUpResponse.status()).toBe(200);
      const followUpData = await followUpResponse.json();
      expect(followUpData.response).toBeTruthy();
    });
  });

  test.describe('Learning AI Workflow', () => {
    
    test('Should complete learning interaction workflow', async () => {
      // Step 1: Ask for a learning question
      const questionResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/learn/askQuestion', {
        context: 'Learning about emotional regulation and self-awareness',
        locale: 'en'
      });
      
      expect(questionResponse.status()).toBe(200);
      const questionData = await questionResponse.json();
      expect(questionData.question).toBeTruthy();
      
      // Step 2: Analyze feelings from user input
      const feelingsResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/learn/feelingsDetective', {
        userInput: 'I am feeling overwhelmed, anxious, and a bit hopeful about the future',
        locale: 'en'
      });
      
      expect(feelingsResponse.status()).toBe(200);
      const feelingsData = await feelingsResponse.json();
      expect(feelingsData.analysis).toBeTruthy();
      
      // Step 3: Analyze needs from user input
      const needsResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/learn/needsDetective', {
        userInput: 'I need more stability in my life and better communication with loved ones',
        locale: 'en'
      });
      
      expect(needsResponse.status()).toBe(200);
      const needsData = await needsResponse.json();
      expect(needsData.analysis).toBeTruthy();
      
      // Step 4: Get needs guidance
      const guidanceResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/learn/needsRubiksCube', {
        userNeeds: ['stability', 'communication', 'connection'],
        locale: 'en'
      });
      
      expect(guidanceResponse.status()).toBe(200);
      const guidanceData = await guidanceResponse.json();
      expect(guidanceData.guidance).toBeTruthy();
    });
  });

  test.describe('Cross-Module Integration', () => {
    
    test('Should maintain user context across different AI modules', async () => {
      // Use bullshift to establish emotional context
      const bullshiftChatId = await initializeBullshiftChat(authenticatedPage);
      await sendBullshiftMessage(
        authenticatedPage, 
        bullshiftChatId, 
        'I am dealing with relationship issues and feel disconnected'
      );
      
      // Extract memories
      await makeAuthenticatedRequest(authenticatedPage, '/ai/bullshift/extractMemories', {
        userId: 'test-user-id'
      });
      
      // Use self-empathy with similar context - should benefit from memory
      const selfEmpathyChatId = await initializeSelfEmpathyChat(authenticatedPage);
      const selfEmpathyResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/selfempathy/sendMessage', {
        chatId: selfEmpathyChatId,
        message: 'I want to work on my relationship communication',
        history: []
      });
      
      expect(selfEmpathyResponse.status()).toBe(200);
      const selfEmpathyData = await selfEmpathyResponse.json();
      expect(selfEmpathyData.response).toBeTruthy();
      
      // Use learning module for related topic
      const learningResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/learn/feelingsDetective', {
        userInput: 'I feel disconnected in my relationships',
        locale: 'en'
      });
      
      expect(learningResponse.status()).toBe(200);
      const learningData = await learningResponse.json();
      expect(learningData.analysis).toBeTruthy();
    });

    test('Should handle judgement checking across modules', async () => {
      const judgmentalTexts = [
        'You are always wrong about everything',
        'I hate myself for being so stupid',
        'Everyone is against me and they are all terrible people'
      ];
      
      for (const text of judgmentalTexts) {
        const response = await makeAuthenticatedRequest(authenticatedPage, '/ai/checkForJudgement', {
          text,
          locale: 'en'
        });
        
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty('hasJudgement');
        expect(typeof data.hasJudgement).toBe('boolean');
        // These texts should be detected as judgmental
        expect(data.hasJudgement).toBe(true);
      }
      
      const nonJudgmentalTexts = [
        'I am feeling sad about this situation',
        'I would like to understand this better',
        'I am curious about different perspectives'
      ];
      
      for (const text of nonJudgmentalTexts) {
        const response = await makeAuthenticatedRequest(authenticatedPage, '/ai/checkForJudgement', {
          text,
          locale: 'en'
        });
        
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data.hasJudgement).toBe(false);
      }
    });
  });

  test.describe('Error Recovery and Resilience', () => {
    
    test('Should recover from temporary failures', async () => {
      const chatId = await initializeBullshiftChat(authenticatedPage);
      
      // Send a normal message first
      const normalResponse = await sendBullshiftMessage(
        authenticatedPage, 
        chatId, 
        'This is a normal message'
      );
      expect(normalResponse.response).toBeTruthy();
      
      // Try to send a potentially problematic message
      const problematicResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/bullshift/send', {
        chatId,
        message: 'What if the AI system fails completely and cannot respond?',
        userId: 'test-user-id',
        locale: 'en'
      });
      
      // Should either succeed or fail gracefully
      if (problematicResponse.status() === 200) {
        const data = await problematicResponse.json();
        expect(data.response).toBeTruthy();
      } else {
        expect([400, 500, 504].includes(problematicResponse.status())).toBe(true);
      }
      
      // Should be able to continue conversation after any error
      const recoveryResponse = await sendBullshiftMessage(
        authenticatedPage, 
        chatId, 
        'Let me try a different approach'
      );
      expect(recoveryResponse.response).toBeTruthy();
    });

    test('Should handle concurrent requests without data corruption', async () => {
      const chatId = await initializeBullshiftChat(authenticatedPage);
      
      // Send multiple concurrent messages
      const concurrentMessages = [
        'Message 1: I am feeling anxious',
        'Message 2: I need help with stress',
        'Message 3: Can you guide me through this?'
      ];
      
      const promises = concurrentMessages.map(message => 
        makeAuthenticatedRequest(authenticatedPage, '/ai/bullshift/send', {
          chatId,
          message,
          userId: 'test-user-id',
          locale: 'en'
        })
      );
      
      const responses = await Promise.allSettled(promises);
      
      // At least some should succeed
      const successfulResponses = responses.filter(r => 
        r.status === 'fulfilled' && r.value.status() === 200
      );
      expect(successfulResponses.length).toBeGreaterThan(0);
      
      // None should cause data corruption (all should be proper JSON)
      for (const response of responses) {
        if (response.status === 'fulfilled' && response.value.status() === 200) {
          const data = await response.value.json();
          expect(data).toBeTruthy();
          expect(data.response || data.error).toBeTruthy();
        }
      }
    });
  });

  test.describe('Performance and Scalability', () => {
    
    test('Should handle large conversation history', async () => {
      const chatId = await initializeBullshiftChat(authenticatedPage);
      
      // Build up conversation history
      const messages = Array.from({ length: 10 }, (_, i) => 
        `Message ${i + 1}: I am sharing my thoughts and feelings about various aspects of my life`
      );
      
      // Send messages sequentially to build history
      for (const message of messages) {
        const response = await sendBullshiftMessage(authenticatedPage, chatId, message);
        expect(response.response).toBeTruthy();
      }
      
      // Analyze the chat with large history
      const analysisResponse = await makeAuthenticatedRequest(authenticatedPage, '/ai/bullshift/analyzeChat', {
        chatId,
        locale: 'en'
      });
      
      expect(analysisResponse.status()).toBe(200);
      const analysisData = await analysisResponse.json();
      expect(analysisData.analysis).toBeTruthy();
    });

    test('Should handle various input lengths and complexities', async () => {
      const testInputs = [
        // Short input
        'Help',
        // Medium input
        'I am feeling overwhelmed with work and need some guidance on managing stress',
        // Long input
        'I have been struggling with various aspects of my life including work stress, relationship difficulties, family obligations, financial concerns, health issues, and personal growth challenges. Each of these areas seems to compound the others, creating a complex web of interconnected problems that I find difficult to untangle. I would like to understand how to approach these challenges systematically and develop better coping strategies.',
        // Input with special characters
        'I feel like @#$%! and don\'t know what to do... (seriously though, I need help)',
        // Input with numbers and mixed content
        'I have 3 major deadlines this week, 2 family events, and 1 important decision to make about my career by Friday at 5:00 PM'
      ];
      
      for (const input of testInputs) {
        const response = await makeAuthenticatedRequest(authenticatedPage, '/ai/checkForJudgement', {
          text: input,
          locale: 'en'
        });
        
        expect(response.status()).toBe(200);
        const data = await response.json();
        expect(data).toHaveProperty('hasJudgement');
      }
    });
  });
});