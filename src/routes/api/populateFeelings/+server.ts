import {feelings} from '$static/feelings'
import PocketBase from 'pocketbase';

export const prerender = false;

const pb = new PocketBase('https://backend.empathy-link.de');

export const GET = async ({ url, request }) => {
	
	for(const feeling of feelings){
		const record = await pb.collection('feelings').create(feeling);
	}
	return new Response('hi');
};
