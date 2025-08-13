import { json, type RequestHandler} from '@sveltejs/kit' 
import { PUBLIC_POSTHOG_KEY } from '$env/static/public';

export const POST = (async ({ request, locals }) => {
  try {
    const user = locals.user;
    if (!user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: PUBLIC_POSTHOG_KEY,
        distinct_id: user.id
      })
    };
  
    const ph_request = await fetch(
      'https://eu.i.posthog.com/decide?v=3',
      requestOptions
    );
    const data = await ph_request.json(); 
    return json(data)
    
  } catch (error) {
    console.error('Request failed:', error);
    return json({ error: 'Request failed' }, { status: 500 });
  }
 
}) satisfies RequestHandler;