import { pb } from '$scripts/pocketbase';
import type { LearningSession, SessionResponse, ContentBlock } from '$routes/bullshift/learn/[slug]/edit/schema';

// Simple utility functions for learning session management
export const learningSession = {
  // Initialize or resume a learning session (one session per user per topic)
  async init(userId: string, topicId: string, topicVersionId: string): Promise<LearningSession> {
    try {
      console.log('🔄 learningSession.init called with:', { userId, topicId, topicVersionId });
      console.log('🔐 PocketBase auth state in init:', {
        isValid: pb.authStore.isValid,
        model: pb.authStore.model?.id,
        token: pb.authStore.token ? 'present' : 'missing'
      });
      
      // Check for existing session (completed or incomplete)
      const existingSessions = await pb.collection('learnSessions').getList(1, 50, {
        filter: `user = "${userId}" && topic = "${topicId}"`,
        sort: '-created'
      });

      if (existingSessions.items.length > 0) {
        const latestSession = existingSessions.items[0] as unknown as LearningSession;
        
        // If latest session is incomplete (not completed), resume it
        if (!latestSession.completed) {
          return latestSession;
        }
        
        // If latest session is completed, clean up any old incomplete sessions
        // and create a new one (user wants to restart)
        const incompleteSessionIds = existingSessions.items
          .filter((session: any) => !session.completed)
          .map((session: any) => session.id);
          
        if (incompleteSessionIds.length > 0) {
          // Mark old incomplete sessions as completed to clean up
          for (const sessionId of incompleteSessionIds) {
            await pb.collection('learnSessions').update(sessionId, {
              completed: true,
              completedAt: new Date().toISOString()
            });
          }
        }
      }

      // Create new session (first time or restarting after completion)
      console.log('🆕 Creating new session with data:', {
        user: userId,
        topic: topicId,
        topicVersion: topicVersionId,
        currentPage: 0,
        responses: [],
        completed: false
      });
      
      const newSession = await pb.collection('learnSessions').create({
        user: userId,
        topic: topicId,
        topicVersion: topicVersionId,
        currentPage: 0,
        responses: [],
        completed: false // Initialize as not completed
      });
      
      console.log('✅ New session created successfully:', newSession.id);
      return newSession as unknown as LearningSession;
    } catch (error) {
      console.error('Failed to initialize learning session:', error);
      throw error;
    }
  },

  // Debounce timers for each block to prevent rapid API calls
  _debounceTimers: new Map<string, ReturnType<typeof setTimeout>>(),

  // Save a response for a specific content block (with debouncing)
  async saveResponse(
    sessionId: string, 
    pageIndex: number, 
    blockIndex: number, 
    blockType: ContentBlock['type'], 
    response: any,
    topicVersionId: string,
    contentBlock: ContentBlock
  ): Promise<void> {
    const blockKey = `${sessionId}-${pageIndex}-${blockIndex}`;
    
    // Clear existing timer for this block
    if (this._debounceTimers.has(blockKey)) {
      clearTimeout(this._debounceTimers.get(blockKey)!);
    }
    
    // Set new debounced timer
    const timer = setTimeout(async () => {
      try {
        // Get current session
        const session = await pb.collection('learnSessions').getOne(sessionId, {
          requestKey: `getSession-${sessionId}-${Date.now()}`
        }) as unknown as LearningSession;
        
        const newResponse: SessionResponse = {
          pageIndex,
          blockIndex,
          blockType,
          response,
          timestamp: new Date().toISOString(),
          topicVersionId,
          blockContent: contentBlock
        };

        // Remove any existing response for this block
        const filteredResponses = session.responses.filter(
          r => !(r.pageIndex === pageIndex && r.blockIndex === blockIndex)
        );

        const updatedResponses = [...filteredResponses, newResponse];

        // Update session in database
        await pb.collection('learnSessions').update(sessionId, {
          responses: updatedResponses
        }, {
          requestKey: `saveResponse-${sessionId}-${pageIndex}-${blockIndex}-${Date.now()}`
        });
        
        // Clean up timer
        this._debounceTimers.delete(blockKey);
      } catch (error) {
        console.error('Failed to save response:', error);
        this._debounceTimers.delete(blockKey);
      }
    }, 500); // 500ms debounce delay
    
    this._debounceTimers.set(blockKey, timer);
  },

  // Force immediate save (useful for important actions like completion)
  async saveResponseImmediate(
    sessionId: string, 
    blockIndex: number, 
    blockType: ContentBlock['type'], 
    response: any,
    topicVersionId: string,
    contentBlock: ContentBlock
  ): Promise<void> {
    const blockKey = `${sessionId}-${blockIndex}`;
    
    // Clear any pending debounced save
    if (this._debounceTimers.has(blockKey)) {
      clearTimeout(this._debounceTimers.get(blockKey)!);
      this._debounceTimers.delete(blockKey);
    }
    
    try {
      // Get current session
      const session = await pb.collection('learnSessions').getOne(sessionId, {
        requestKey: `getSessionImmediate-${sessionId}-${Date.now()}`
      }) as unknown as LearningSession;
      
      const newResponse: SessionResponse = {
        blockIndex,
        blockType,
        response,
        timestamp: new Date().toISOString(),
        topicVersionId,
        blockContent: contentBlock
      };

      // Remove any existing response for this block type and content
      const filteredResponses = session.responses.filter(
        r => !(r.blockType === blockType && JSON.stringify(r.blockContent) === JSON.stringify(contentBlock))
      );

      const updatedResponses = [...filteredResponses, newResponse];

      // Update session in database
      await pb.collection('learnSessions').update(sessionId, {
        responses: updatedResponses
      }, {
        requestKey: `saveResponseImmediate-${sessionId}-${blockIndex}-${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to save response immediately:', error);
      throw error;
    }
  },

  // Update current page
  async updateCurrentPage(sessionId: string, pageIndex: number): Promise<void> {
    try {
      await pb.collection('learnSessions').update(sessionId, {
        currentPage: pageIndex
      }, {
        requestKey: `updateCurrentPage-${sessionId}-${pageIndex}-${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to update current page:', error);
      throw error;
    }
  },

  // Complete the session (set completion flag and datetime)
  async complete(sessionId: string): Promise<void> {
    try {
      await pb.collection('learnSessions').update(sessionId, {
        completed: true,
        completedAt: new Date().toISOString()
      }, {
        requestKey: `complete-${sessionId}-${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to complete session:', error);
      throw error;
    }
  },

  // Mark session as fully completed (final completion)
  async markAsCompleted(sessionId: string): Promise<void> {
    try {
      await pb.collection('learnSessions').update(sessionId, {
        completed: true,
        completedAt: new Date().toISOString()
      }, {
        requestKey: `markAsCompleted-${sessionId}-${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to mark session as completed:', error);
      throw error;
    }
  },

  // Save user feedback for the module
  async saveFeedback(sessionId: string, feedback: { rating: number; feedback: string; improvements: string; }): Promise<void> {
    try {
      await pb.collection('learnSessions').update(sessionId, {
        feedback: {
          ...feedback,
          submittedAt: new Date().toISOString()
        }
      }, {
        requestKey: `saveFeedback-${sessionId}-${Date.now()}`
      });
    } catch (error) {
      console.error('Failed to save feedback:', error);
      throw error;
    }
  },

  // Get response for a specific block (legacy - position-based)
  getResponse(session: LearningSession, pageIndex: number, blockIndex: number): SessionResponse | null {
    return session.responses.find(
      r => r.pageIndex === pageIndex && r.blockIndex === blockIndex
    ) || null;
  },

  // Get response for a specific block using content-based matching (version-independent)
  getResponseByContent(
    session: LearningSession, 
    contentBlock: ContentBlock, 
    pageIndex: number
  ): SessionResponse | null {
    // Try to find by current position first (most common case)
    const positionMatch = session.responses.find(
      r => r.pageIndex === pageIndex && r.blockIndex === pageIndex
    );
    if (positionMatch) return positionMatch;
    
    // Fallback: try to find by matching content (for moved blocks)
    const contentMatch = session.responses.find(response => {
      if (!response.blockContent || response.blockType !== contentBlock.type) {
        return false;
      }
      
      // Simple content comparison - you can make this more sophisticated if needed
      return JSON.stringify(response.blockContent) === JSON.stringify(contentBlock);
    });
    
    return contentMatch || null;
  }
}; 