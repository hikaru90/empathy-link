import {feelings} from '$static/feelings'
import { pb } from '$scripts/pocketbase'

export const prerender = false;

export const GET = async ({ url, request }) => {
	
	for(const feeling of feelings){
		const record = await pb.collection('feelings').create(feeling);
	}
	return new Response('hi');
};
