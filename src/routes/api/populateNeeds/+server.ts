import {needs} from '$static/needs'
import { pb } from '$scripts/pocketbase'

export const prerender = false;

export const GET = async ({ url, request }) => {
	
	for(const need of needs){
		const record = await pb.collection('needs').create(need);
	}
	return new Response('hi');
};
