// Debug script to test token usage calculation
import { pb } from './src/scripts/pocketbase.js';

async function debugTokenUsage() {
  try {
    // Test with a sample user ID (you'll need to replace this with a real user ID)
    const userId = 'YOUR_USER_ID_HERE';
    
    console.log('=== DEBUGGING TOKEN USAGE ===');
    console.log('User ID:', userId);
    
    // Get user details
    const user = await pb.collection('users').getOne(userId);
    console.log('\n=== USER DETAILS ===');
    console.log('User ID:', user.id);
    console.log('User role:', user.role);
    console.log('User email:', user.email);
    
    // Check if user is admin
    const isAdmin = user.role === 'admin' || user.role === 'ADMIN';
    console.log('Is admin:', isAdmin);
    
    // Test different date formats
    console.log('\n=== DATE FORMAT TESTING ===');
    const now = new Date();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    
    console.log('Current time:', now.toISOString());
    console.log('Today start (UTC):', today.toISOString());
    console.log('Today start (local):', today.toString());
    console.log('Today start (local 00:00:00):', today.toString().split(' ')[0] + ' 00:00:00');
    
    // Test 1: Get ALL traces for user (no date filter)
    console.log('\n=== TEST 1: ALL TRACES (no date filter) ===');
    const allTraces = await pb.collection('traces').getList(1, 100, {
      filter: `user = "${userId}"`,
      sort: '-created'
    });
    console.log('Total traces found:', allTraces.items.length);
    if (allTraces.items.length > 0) {
      console.log('Sample trace:', {
        id: allTraces.items[0].id,
        created: allTraces.items[0].created,
        inputTokens: allTraces.items[0].inputTokens,
        outputTokens: allTraces.items[0].outputTokens
      });
    }
    
    // Test 2: Get traces with ISO date filter
    console.log('\n=== TEST 2: ISO DATE FILTER ===');
    const isoTraces = await pb.collection('traces').getList(1, 100, {
      filter: `user = "${userId}" && created >= "${today.toISOString()}"`,
      sort: '-created'
    });
    console.log('ISO filtered traces found:', isoTraces.items.length);
    
    // Test 3: Get traces with local date filter (like other components)
    console.log('\n=== TEST 3: LOCAL DATE FILTER ===');
    const localDateStr = today.toString().split(' ')[0] + ' 00:00:00';
    const localTraces = await pb.collection('traces').getList(1, 100, {
      filter: `user = "${userId}" && created >= "${localDateStr}"`,
      sort: '-created'
    });
    console.log('Local date filtered traces found:', localTraces.items.length);
    
    // Test 4: Get traces from last 24 hours
    console.log('\n=== TEST 4: LAST 24 HOURS ===');
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last24hTraces = await pb.collection('traces').getList(1, 100, {
      filter: `user = "${userId}" && created >= "${yesterday.toISOString()}"`,
      sort: '-created'
    });
    console.log('Last 24h traces found:', last24hTraces.items.length);
    
    // Calculate token usage for each test
    console.log('\n=== TOKEN USAGE CALCULATION ===');
    
    const calculateTokens = (traces) => {
      const inputTokens = traces.items.reduce((sum, trace) => sum + (trace.inputTokens || 0), 0);
      const outputTokens = traces.items.reduce((sum, trace) => sum + (trace.outputTokens || 0), 0);
      return { inputTokens, outputTokens, total: inputTokens + outputTokens };
    };
    
    console.log('All traces tokens:', calculateTokens(allTraces));
    console.log('ISO filtered tokens:', calculateTokens(isoTraces));
    console.log('Local date filtered tokens:', calculateTokens(localTraces));
    console.log('Last 24h tokens:', calculateTokens(last24hTraces));
    
    // Check limits
    const DAILY_LIMIT = 100000;
    const ADMIN_DAILY_LIMIT = 100;
    
    const tokenLimit = isAdmin ? ADMIN_DAILY_LIMIT : DAILY_LIMIT;
    const remaining = Math.max(0, tokenLimit - calculateTokens(isoTraces).total);
    
    console.log('\n=== FINAL RESULT ===');
    console.log('User limit:', tokenLimit);
    console.log('Tokens used today (ISO):', calculateTokens(isoTraces).total);
    console.log('Tokens remaining:', remaining);
    console.log('Can send message:', remaining > 0);
    
  } catch (error) {
    console.error('Error debugging token usage:', error);
  }
}

// Run the debug
debugTokenUsage();
