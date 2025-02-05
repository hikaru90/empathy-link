<script lang="ts">
  import { messages, addMessage, formatTimestamp } from '$store/chatStore';

  let userMessage = '';
  let isLoading = false;

  async function handleSendMessage() {
    if (!userMessage.trim()) return;
    
    isLoading = true;
    addMessage('user', userMessage);
    const messageToSend = userMessage;
    userMessage = ''; // Clear input
    
    try {
      const response = await fetch('/api/ai/selfempathyChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: messageToSend,
          history: $messages // Send current chat history
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      addMessage('assistant', data.response);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="h-full rounded-lg relative flex flex-col bg-[rgba(0,0,0,0.03)] border-b border-white/80 overflow-hidden">
  <div class="h-full flex-grow p-4 chat-shadow rounded-lg overflow-y-auto">
    {#each $messages as message}
      <div class="mb-4 {message.role === 'user' ? 'text-right' : 'text-left'}">
        <div class="inline-block p-3 rounded-lg {message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}">
          <div class="text-sm">{message.content}</div>
          <div class="text-xs text-gray-500 mt-1">{formatTimestamp(message.timestamp)}</div>
        </div>
      </div>
    {/each}
    {#if isLoading}
      <div class="text-center text-gray-500">
        Thinking...
      </div>
    {/if}
  </div>
  
  <div class="p-4 border-t">
    <form on:submit|preventDefault={handleSendMessage} class="flex gap-2">
      <input
        type="text"
        bind:value={userMessage}
        placeholder="Type your message..."
        class="flex-grow p-2 rounded-lg border"
      />
      <button 
        type="submit" 
        disabled={isLoading}
        class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        Send
      </button>
    </form>
  </div>
</div>