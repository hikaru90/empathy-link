import { createMemory, retrieveRelevantMemories, formatMemoriesForPrompt } from './src/lib/server/memory.js';

async function testMemorySystem() {
  const testUserId = 'test-user-123';
  
  console.log('🧪 Testing Memory System...');
  
  try {
    // 1. Create some test memories
    console.log('\n1️⃣ Creating test memories...');
    
    const memory1 = await createMemory(
      testUserId, 
      "User prefers gentle communication and gets stressed by aggressive feedback"
    );
    console.log('✅ Created memory 1:', memory1?.type, '-', memory1?.value?.substring(0, 50) + '...');
    
    const memory2 = await createMemory(
      testUserId,
      "User usually feels overwhelmed on Mondays and tends to procrastinate"
    );
    console.log('✅ Created memory 2:', memory2?.type, '-', memory2?.value?.substring(0, 50) + '...');
    
    const memory3 = await createMemory(
      testUserId,
      "User currently dealing with work-life balance issues this week"
    );
    console.log('✅ Created memory 3:', memory3?.type, '-', memory3?.value?.substring(0, 50) + '...');
    
    // 2. Test memory retrieval
    console.log('\n2️⃣ Testing memory retrieval...');
    
    const testQuery = "I'm feeling overwhelmed with work feedback today";
    const relevantMemories = await retrieveRelevantMemories(testUserId, testQuery, 3);
    
    console.log(`📋 Found ${relevantMemories.length} relevant memories for: "${testQuery}"`);
    relevantMemories.forEach((memory, i) => {
      console.log(`   ${i+1}. [${memory.type}] ${memory.value.substring(0, 60)}...`);
    });
    
    // 3. Test prompt formatting
    console.log('\n3️⃣ Testing prompt formatting...');
    const formattedPrompt = formatMemoriesForPrompt(relevantMemories);
    console.log('📝 Formatted for AI prompt:');
    console.log(formattedPrompt);
    
    console.log('\n✅ Memory system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testMemorySystem().catch(console.error);