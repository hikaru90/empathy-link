// Simple test script to debug token usage
import { pb } from './src/scripts/pocketbase.js';

async function testTokenUsage() {
  try {
    // Test with a sample user ID (you'll need to replace this with a real user ID)
    const userId = 'YOUR_USER_ID_HERE';
    
    console.log('Testing token usage for user:', userId);
    
    // Get user details
    const user = await pb.collection('users').getOne(userId);
    console.log('User details:', {
      id: user.id,
      role: user.role,
      email: user.email
    });
    
    // Check if user is admin
    const isAdmin = user.role === 'admin' || user.role === 'ADMIN';
    console.log('Is admin:', isAdmin);
    
    // Get today's traces
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    
    console.log('Today start (UTC):', todayISO);
    
    const traces = await pb.collection('traces').getList(1, 1000, {
      filter: `user = "${userId}" && created >= "${todayISO}"`,
      sort: '-created'
    });
    
    console.log('Traces found today:', traces.items.length);
    console.log('Sample trace:', traces.items[0] || 'No traces found');
    
    // Calculate token usage
    const totalInputTokens = traces.items.reduce((sum, trace) => sum + (trace.inputTokens || 0), 0);
    const totalOutputTokens = traces.items.reduce((sum, trace) => sum + (trace.outputTokens || 0), 0);
    const totalTokensUsed = totalInputTokens + totalOutputTokens;
    
    console.log('Token usage today:', {
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      totalUsed: totalTokensUsed
    });
    
    // Check limits
    const DAILY_LIMIT = 100000;
    const ADMIN_DAILY_LIMIT = 100;
    
    const tokenLimit = isAdmin ? ADMIN_DAILY_LIMIT : DAILY_LIMIT;
    const remaining = Math.max(0, tokenLimit - totalTokensUsed);
    
    console.log('Token limits:', {
      userLimit: tokenLimit,
      remaining,
      canSendMessage: remaining > 0
    });
    
  } catch (error) {
    console.error('Error testing token usage:', error);
  }
}

// Run the test
testTokenUsage();
