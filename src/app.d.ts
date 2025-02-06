// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

declare global {
	namespace App {
		export interface User {
			id: string;
			email: string;
			username: string;
			firstName: string;
			lastName: string;
			emailVisibility: boolean;
			verified: boolean;
			created: string;
			updated: string;
			collectionId: '_pb_users_auth_';
			collectionName: 'users';
		}
		interface Locals {
			pb: PocketBase;
			user: User;
			locale: string;
			sessionToken: string;
			userId: string;
			posthogId: string;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
