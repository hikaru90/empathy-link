import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { plotX, plotY } = await request.json();

        // Validate input
        if (plotX < 0 || plotX > 8 || plotY < 0 || plotY > 8) {
            return new Response('Invalid plot coordinates', { status: 400 });
        }

        // Get user's garden
        const garden = await pb.collection('gardens').getFirstListItem(
            `user="${user.id}"`
        );

        // Check if plot has a plant
        const plotIndex = plotY * 9 + plotX;
        const plot = garden.grid_data.plots[plotIndex];
        
        if (!plot.plant_id) {
            return new Response('Plot is empty', { status: 400 });
        }

        const plantId = plot.plant_id;

        // Check if user already has this item in inventory
        let userItem;
        try {
            userItem = await pb.collection('user_items').getFirstListItem(
                `user="${user.id}" && item="${plantId}"`
            );
        } catch (error) {
            // Item doesn't exist in inventory yet
            userItem = null;
        }

        // Update grid data - remove plant
        const gridData = { ...garden.grid_data };
        gridData.plots[plotIndex] = {
            ...gridData.plots[plotIndex],
            plant_id: null,
            planted_at: null,
            growth_stage: 0
        };

        // Update garden
        await pb.collection('gardens').update(garden.id, {
            grid_data: gridData,
            total_plants: garden.total_plants - 1
        });

        // Add item back to inventory
        if (userItem) {
            // Update existing item quantity
            await pb.collection('user_items').update(userItem.id, {
                quantity: userItem.quantity + 1
            });
        } else {
            // Create new inventory item
            await pb.collection('user_items').create({
                user: user.id,
                item: plantId,
                quantity: 1,
                acquired_at: new Date().toISOString()
            });
        }

        return json({ 
            success: true, 
            plot: gridData.plots[plotIndex],
            returnedItem: plantId
        });

    } catch (error) {
        console.error('Error unplanting:', error);
        return new Response('Internal server error', { status: 500 });
    }
};
