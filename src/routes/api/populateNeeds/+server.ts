import {needs} from '$static/needs'
import PocketBase from 'pocketbase';

export const prerender = false;

const pb = new PocketBase('https://backend.empathy-link.de');

export const GET = async ({ url, request }) => {
	
	for(const need of needs){
		const record = await pb.collection('needs').create(need);
	}
	return new Response('hi');
};
