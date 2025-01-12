export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14')
];

export const server_loads = [0,2];

export const dictionary = {
		"/": [3],
		"/app/auth/login": [~4,[2]],
		"/app/auth/register": [~5,[2]],
		"/app/dashboard": [6,[2]],
		"/app/fights": [7,[2]],
		"/app/fights/create": [8,[2]],
		"/app/fights/[id]": [9,[2]],
		"/app/fights/[id]/respond": [~10,[2]],
		"/app/selfempathy": [11,[2]],
		"/app/selfempathy/create": [12,[2]],
		"/app/selfempathy/[id]": [13,[2]],
		"/app/selfempathy/[id]/respond": [~14,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),

	reroute: (() => {})
};

export { default as root } from '../root.svelte';