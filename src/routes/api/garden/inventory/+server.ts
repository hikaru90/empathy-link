import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		// Generate unique request key
		const requestKey = `inventory-${user.id}-${Date.now()}`;

		// Get user's items with item details
		const userItems = await pb.collection('user_items').getFullList({
			filter: `user="${user.id}"`,
			expand: 'item',
			requestKey: requestKey
		});

		// Transform the data to include item details
		const inventory = userItems.map(userItem => ({
			id: userItem.id,
			item: userItem.item,
			quantity: userItem.quantity,
			acquired_at: userItem.acquired_at,
			itemData: userItem.expand?.item ? {
				id: userItem.expand.item.id,
				name: userItem.expand.item.name,
				description: userItem.expand.item.description,
				category: userItem.expand.item.category,
				sprite: userItem.expand.item.sprite
			} : undefined
		}));

		return json({ 
			inventory,
			count: inventory.length 
		});

	} catch (error) {
		console.error('Error loading inventory:', error);
		return json({ error: 'Failed to load inventory' }, { status: 500 });
	}
};