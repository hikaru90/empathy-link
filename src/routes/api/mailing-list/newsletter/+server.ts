import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$scripts/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email } = await request.json();

		// Validate email
		if (!email || typeof email !== 'string') {
			return json({ error: 'E-Mail-Adresse ist erforderlich' }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Ungültiges E-Mail-Format' }, { status: 400 });
		}

		// Normalize email for consistency
		const normalizedEmail = email.toLowerCase().trim();

		// Check if email already exists in any mailing list (enforce global uniqueness)
		const existingEmail = await pb.collection('mailingList').getFirstListItem(
			`email="${normalizedEmail}"`,
			{ requestKey: null }
		).catch(() => null);

		// If email exists but for different list type, prevent signup
		if (existingEmail && existingEmail.type !== 'newsletter') {
			return json({
				error: 'Du bist schon angemeldet',
				success: false
			}, { status: 400 });
		}

		// Check if already subscribed to newsletter specifically
		const existingSubscription = existingEmail;

		if (existingSubscription) {
			if (existingSubscription.status === 'active') {
				return json({
					message: 'Du bist bereits für unseren Newsletter angemeldet',
					success: true
				});
			} else if (existingSubscription.status === 'unconfirmed') {
				// Confirm subscription
				await pb.collection('mailingList').update(existingSubscription.id, {
					status: 'active',
					updated: new Date().toISOString()
				});
				return json({
					message: 'Deine Newsletter-Anmeldung wurde bestätigt',
					success: true
				});
			} else {
				// Reactivate unsubscribed subscription
				await pb.collection('mailingList').update(existingSubscription.id, {
					status: 'active',
					updated: new Date().toISOString()
				});
				return json({
					message: 'Deine Newsletter-Anmeldung wurde reaktiviert',
					success: true
				});
			}
		}

		// Create new subscription with normalized email
		const record = await pb.collection('mailingList').create({
			type: 'newsletter',
			email: normalizedEmail,
			status: 'active',
			source: 'website'
		});

		return json({
			message: 'Erfolgreich für den Newsletter angemeldet',
			success: true,
			id: record.id
		});

	} catch (error: any) {
		console.error('Newsletter subscription error:', error);

		// Check if it's a PocketBase unique constraint error
		// PocketBase returns errors in response.data or data property
		if (error?.status === 400) {
			const errorData = error?.response?.data || error?.data;

			// Check if error is related to email field (indicates uniqueness violation)
			if (errorData?.email) {
				return json({
					error: 'Du bist schon angemeldet',
					success: false
				}, { status: 400 });
			}
		}

		// Check for other common PocketBase error patterns
		if (error?.message?.includes('email') && (error?.message?.includes('unique') || error?.message?.includes('duplicate'))) {
			return json({
				error: 'Du bist schon angemeldet',
				success: false
			}, { status: 400 });
		}

		// Log error to PocketBase
		try {
			await pb.collection('errors').create({
				message: 'Newsletter subscription failed',
				error: error instanceof Error ? error.message : String(error),
				context: 'mailing-list-newsletter',
				timestamp: new Date().toISOString()
			});
		} catch (logError) {
			console.error('Failed to log error:', logError);
		}

		return json({
			error: 'Newsletter-Anmeldung fehlgeschlagen. Bitte versuche es erneut.'
		}, { status: 500 });
	}
};
