import { json } from '@sveltejs/kit';
import { pb } from '$scripts/pocketbase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { plotX, plotY, plantId } = await request.json();

        // Validate input
        if (plotX < 0 || plotX > 8 || plotY < 0 || plotY > 8) {
            return new Response('Invalid plot coordinates', { status: 400 });
        }

        // Get user's garden
        const garden = await pb.collection('gardens').getFirstListItem(
            `user="${user.id}"`
        );

        // Get plant info
        const plant = await pb.collection('items').getOne(plantId);

        // Check if user has this item in their inventory
        const userItem = await pb.collection('user_items').getFirstListItem(
            `user="${user.id}" && item="${plantId}"`
        );
        
        if (!userItem || userItem.quantity < 1) {
            return new Response('Item not in inventory', { status: 400 });
        }

        // Check if plot is empty
        const plotIndex = plotY * 9 + plotX;
        if (garden.grid_data.plots[plotIndex].plant_id) {
            return new Response('Plot already occupied', { status: 400 });
        }

        // Deduct item from inventory FIRST
        const newQuantity = userItem.quantity - 1;
        if (newQuantity > 0) {
            await pb.collection('user_items').update(userItem.id, {
                quantity: newQuantity
            });
        } else {
            // Delete the item if quantity becomes 0
            await pb.collection('user_items').delete(userItem.id);
        }

        // Update grid data AFTER successful inventory update
        const gridData = { ...garden.grid_data };
        gridData.plots[plotIndex] = {
            ...gridData.plots[plotIndex],
            plant_id: plantId,
            planted_at: new Date().toISOString(),
            growth_stage: 0
        };

        // Update garden
        await pb.collection('gardens').update(garden.id, {
            grid_data: gridData,
            total_plants: garden.total_plants + 1
        });

        return json({ 
            success: true, 
            plot: gridData.plots[plotIndex],
            remainingQuantity: newQuantity > 0 ? newQuantity : 0
        });

    } catch (error) {
        console.error('Error planting:', error);
        return new Response('Internal server error', { status: 500 });
    }
};

