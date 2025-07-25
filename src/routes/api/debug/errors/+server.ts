import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';

export async function GET({ locals }) {
  const user = locals.user;
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the most recent error records
    const errors = await pb.collection('errors').getList(1, 5, {
      sort: '-created'
    });

    return json({ 
      success: true, 
      errors: errors.items,
      totalItems: errors.totalItems 
    });
  } catch (error) {
    console.error('Failed to fetch errors:', error);
    return json({ 
      error: 'Failed to fetch errors',
      details: error 
    }, { status: 500 });
  }
}