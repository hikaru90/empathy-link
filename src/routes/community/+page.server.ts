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

        // Try to get user seeds - get all and use the first one, or create new
        let userSeeds;
        try {
            const existingSeeds = await pb.collection('user_seeds').getFullList({
                filter: `user="${user.id}"`,
                sort: 'created'
            });
            
            if (existingSeeds.length > 0) {
                userSeeds = existingSeeds[0]; // Use the oldest one
                
                // If there are multiple records, delete the duplicates
                if (existingSeeds.length > 1) {
                    console.log(`Found ${existingSeeds.length} user_seeds records for user ${user.id}, keeping the oldest`);
                    for (let i = 1; i < existingSeeds.length; i++) {
                        await pb.collection('user_seeds').delete(existingSeeds[i].id);
                    }
                }
            } else {
                // No seeds exist, create initial inventory
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
        } catch (error) {
            console.error('Error handling user seeds:', error);
            throw error;
        }

        // Get available items from shop
        let plantsAvailable;
        try {
            console.log('Fetching items from PocketBase...');
            plantsAvailable = await pb.collection('items').getFullList({
                filter: 'is_active=true',
                sort: 'category,seed_cost,name'
            });
            console.log('Items fetched:', plantsAvailable);
        } catch (error) {
            console.error('Error fetching items:', error);
            plantsAvailable = [];
        }

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