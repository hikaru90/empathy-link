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

        const plotIndex = plotY * 9 + plotX;
        const currentPlot = garden.grid_data.plots[plotIndex];

        // Handle terraform items differently
        if (plant.category === 'terraform') {
            console.log('Processing terraform item:', plant.name, 'type:', plant.terraform_type);
            
            // Terraform items modify the plot type, not plant something
            if (plant.terraform_type === 'water' && currentPlot.plant_id) {
                return new Response('Cannot place water on occupied plot', { status: 400 });
            }
            
            // Deduct item from inventory
            const newQuantity = userItem.quantity - 1;
            if (newQuantity > 0) {
                await pb.collection('user_items').update(userItem.id, {
                    quantity: newQuantity
                });
            } else {
                await pb.collection('user_items').delete(userItem.id);
            }

            // Update plot terrain
            const gridData = { ...garden.grid_data };
            const newBuildLevel = plant.terraform_type === 'dirt' ? (currentPlot.build_level || 0) + 1 : currentPlot.build_level || 0;
            
            console.log('Updating plot terrain:', {
                oldType: currentPlot.type,
                newType: plant.terraform_type,
                oldBuildLevel: currentPlot.build_level || 0,
                newBuildLevel: newBuildLevel
            });
            
            gridData.plots[plotIndex] = {
                ...gridData.plots[plotIndex],
                type: plant.terraform_type,
                build_level: newBuildLevel,
                // Clear plant if placing water
                plant_id: plant.terraform_type === 'water' ? null : currentPlot.plant_id,
                planted_at: plant.terraform_type === 'water' ? null : currentPlot.planted_at,
                growth_stage: plant.terraform_type === 'water' ? 0 : currentPlot.growth_stage
            };

            await pb.collection('gardens').update(garden.id, {
                grid_data: gridData
            });

            return json({ 
                success: true, 
                plot: gridData.plots[plotIndex],
                remainingQuantity: newQuantity > 0 ? newQuantity : 0,
                terraform: true
            });
        } else {
            // Regular planting logic
            if (currentPlot.plant_id) {
                return new Response('Plot already occupied', { status: 400 });
            }

            // Cannot plant on water
            if (currentPlot.type === 'water') {
                return new Response('Cannot plant on water', { status: 400 });
            }

            // Deduct item from inventory
            const newQuantity = userItem.quantity - 1;
            if (newQuantity > 0) {
                await pb.collection('user_items').update(userItem.id, {
                    quantity: newQuantity
                });
            } else {
                await pb.collection('user_items').delete(userItem.id);
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

            return json({ 
                success: true, 
                plot: gridData.plots[plotIndex],
                remainingQuantity: newQuantity > 0 ? newQuantity : 0,
                terraform: false
            });
        }

    } catch (error) {
        console.error('Error planting:', error);
        return new Response('Internal server error', { status: 500 });
    }
};

