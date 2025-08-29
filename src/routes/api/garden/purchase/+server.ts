import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user;
	if (!user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { plantId } = await request.json();
		
		if (!plantId) {
			return json({ error: 'Plant ID is required' }, { status: 400 });
		}

		// Generate unique request key for this purchase
		const requestKey = `purchase-${user.id}-${plantId}-${Date.now()}`;

		// Get the item details
		const item = await pb.collection('items').getOne(plantId, {
			requestKey: requestKey + '-item'
		});
		if (!item) {
			return json({ error: 'Item not found' }, { status: 404 });
		}

		// Get user's current seed inventory - get all and use the first one
		const existingSeeds = await pb.collection('user_seeds').getFullList({
			filter: `user="${user.id}"`,
			sort: 'created',
			requestKey: requestKey + '-seeds'
		});
		
		if (existingSeeds.length === 0) {
			return json({ error: 'No seed inventory found' }, { status: 404 });
		}
		
		const userSeeds = existingSeeds[0]; // Use the oldest one

		const currentSeeds = userSeeds.seed_inventory.basic || 0;
		
		// Check if user can afford the item
		if (currentSeeds < item.seed_cost) {
			return json({ error: 'Not enough seeds' }, { status: 400 });
		}

		// Deduct seeds from user's inventory
		const newSeedCount = currentSeeds - item.seed_cost;
		const updatedInventory = {
			...userSeeds.seed_inventory,
			basic: newSeedCount
		};

		await pb.collection('user_seeds').update(userSeeds.id, {
			seed_inventory: updatedInventory
		}, {
			requestKey: requestKey + '-update'
		});

		// Add item to user's inventory
		try {
			await pb.collection('user_items').create({
				user: user.id,
				item: plantId,
				quantity: 1,
				acquired_at: new Date().toISOString()
			}, {
				requestKey: requestKey + '-inventory'
			});
		} catch (inventoryError) {
			console.error('Failed to add item to inventory:', inventoryError);
			// Continue anyway - seeds were deducted successfully
		}
		
		return json({ 
			success: true, 
			message: `Successfully purchased ${item.name}`,
			remainingSeeds: newSeedCount
		});

	} catch (error) {
		console.error('Error processing purchase:', error);
		return json({ error: 'Failed to process purchase' }, { status: 500 });
	}
};