// @ts-nocheck
import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';
import { error } from '@sveltejs/kit';

export const prerender = false;

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const { id } = params;

	try {
		let response = null;
		const fight = await pb.collection('fights').getOne(id, {
			expand: 'owner'
		});

    console.log('fight',fight);

		const fightOwner = fight.expand?.owner;
    console.log('fightOwner',fightOwner);
		if (fightOwner?.email !== locals.user?.email) {
      response = await pb.collection('fights').update(id, { opened: true });
		}
    console.log('fightOwner?.email',fightOwner?.email,locals.user?.email);
    console.log('owner response', response);
		return {
			response
		};
	} catch (err) {
		console.error('Error updating fight response:', err);
		// throw error(404, 'Fight response not found');
	}
};
