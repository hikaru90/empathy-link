import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const user = locals.user;
    
    if (!user) {
        throw redirect(302, '/app/auth/login');
    }

    try {
        // Try to get existing garden
        let garden;
        try {
            garden = await pb.collection('gardens').getFirstListItem(
                `user="${user.id}"`
            );
        } catch (error) {
            // Garden doesn't exist, create it
            const emptyGrid = {
                plots: Array.from({ length: 81 }, (_, i) => ({
                    x: i % 9,
                    y: Math.floor(i / 9),
                    type: 'soil',
                    plant_id: null,
                    planted_at: null,
                    growth_stage: 0,
                    last_watered: null
                }))
            };

            try {
                const gardenData = {
                    user: user.id,
                    name: '',
                    grid_data: emptyGrid,
                    current_weather: 'sunny',
                    last_weather_update: new Date().toISOString(),
                    total_plants: Number(0),
                    garden_level: Number(1),
                    is_public: Boolean(true)
                };
                
                console.log('Creating garden with data:', JSON.stringify(gardenData, null, 2));
                
                garden = await pb.collection('gardens').create(gardenData);
            } catch (createError) {
                console.error('Failed to create garden:', createError);
                console.error('Error details:', JSON.stringify(createError.response, null, 2));
                throw createError;
            }
        }

        // Try to get user seeds
        let userSeeds;
        try {
            userSeeds = await pb.collection('user_seeds').getFirstListItem(
                `user="${user.id}"`
            );
        } catch (error) {
            // Seeds don't exist, create initial inventory
            userSeeds = await pb.collection('user_seeds').create({
                user: user.id,
                seed_inventory: {
                    basic: 5, // Give some starter seeds
                    rare: 1,
                    legendary: 0,
                    flower_seeds: 3,
                    tree_seeds: 1,
                    decoration_tokens: 2
                },
                total_seeds_earned: 5
            });
        }

        // Get available plants from catalog
        const plantsAvailable = await pb.collection('plants_catalog').getFullList({
            filter: 'is_active=true',
            sort: 'category,seed_cost,name'
        });

        return {
            garden,
            userSeeds,
            plantsAvailable,
            user
        };
    } catch (error) {
        console.error('Error loading garden data:', error);
        throw redirect(302, '/bullshift'); // Fallback redirect
    }
};