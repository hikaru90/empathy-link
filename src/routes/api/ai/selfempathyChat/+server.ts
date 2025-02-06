import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sendMessage } from '$lib/server/gemini';


export const POST: RequestHandler = async ({ request, locals }) => {
  const { message, history } = await request.json();
  const user = locals.user;
  console.log('user',user);

  if (!user.id) {
    return json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  try {
    const response = await sendMessage(message, history, user);
    return json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    return json(
      { error: 'Failed to process message' }, 
      { status: 500 }
    );
  }
};