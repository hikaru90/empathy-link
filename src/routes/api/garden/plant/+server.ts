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
        const plant = await pb.collection('plants_catalog').getOne(plantId);

        // Get user's seeds
        const userSeeds = await pb.collection('user_seeds').getFirstListItem(
            `user="${user.id}"`
        );

        // Check if user has enough seeds
        const seedType = getSeedTypeForPlant(plant.category);
        if ((userSeeds.seed_inventory[seedType] || 0) < plant.seed_cost) {
            return new Response('Insufficient seeds', { status: 400 });
        }

        // Check if plot is empty
        const plotIndex = plotY * 9 + plotX;
        if (garden.grid_data.plots[plotIndex].plant_id) {
            return new Response('Plot already occupied', { status: 400 });
        }

        // Update grid data
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

        // Deduct seeds
        const updatedInventory = { ...userSeeds.seed_inventory };
        updatedInventory[seedType] = (updatedInventory[seedType] || 0) - plant.seed_cost;

        await pb.collection('user_seeds').update(userSeeds.id, {
            seed_inventory: updatedInventory
        });

        return json({ 
            success: true, 
            plot: gridData.plots[plotIndex],
            remainingSeeds: updatedInventory[seedType]
        });

    } catch (error) {
        console.error('Error planting:', error);
        return new Response('Internal server error', { status: 500 });
    }
};

function getSeedTypeForPlant(category: string): string {
    switch (category) {
        case 'flower': return 'flower_seeds';
        case 'tree': return 'tree_seeds';
        case 'decoration': return 'decoration_tokens';
        default: return 'basic';
    }
}