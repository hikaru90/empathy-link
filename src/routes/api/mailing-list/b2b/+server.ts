import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$scripts/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, companyName, email, message } = await request.json();

		// Validate required fields
		if (!name || typeof name !== 'string') {
			return json({ error: 'Name ist erforderlich' }, { status: 400 });
		}

		if (!companyName || typeof companyName !== 'string') {
			return json({ error: 'Firmenname ist erforderlich' }, { status: 400 });
		}

		if (!email || typeof email !== 'string') {
			return json({ error: 'E-Mail-Adresse ist erforderlich' }, { status: 400 });
		}

		if (!message || typeof message !== 'string') {
			return json({ error: 'Nachricht ist erforderlich' }, { status: 400 });
		}

		// Basic email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json({ error: 'Ungültiges E-Mail-Format' }, { status: 400 });
		}

		// Normalize email for consistency
		const normalizedEmail = email.toLowerCase().trim();

		// Create B2B inquiry record
		const record = await pb.collection('mailingList').create({
			type: 'business',
			email: normalizedEmail,
			status: 'active',
			source: 'website',
			metadata: JSON.stringify({
				name: name.trim(),
				companyName: companyName.trim(),
				message: message.trim(),
				submittedAt: new Date().toISOString()
			})
		});

		return json({
			message: 'Vielen Dank für deine Anfrage! Wir melden uns in Kürze bei dir.',
			success: true,
			id: record.id
		});

	} catch (error: any) {
		console.error('B2B inquiry error:', error);

		// Check if it's a PocketBase unique constraint error
		if (error?.status === 400) {
			const errorData = error?.response?.data || error?.data;

			// Check if error is related to email field (indicates duplicate submission)
			if (errorData?.email) {
				return json({
					error: 'Du hast bereits eine Anfrage gestellt',
					success: false
				}, { status: 400 });
			}
		}

		// Check for other common PocketBase error patterns
		if (error?.message?.includes('email') && (error?.message?.includes('unique') || error?.message?.includes('duplicate'))) {
			return json({
				error: 'Du hast bereits eine Anfrage gestellt',
				success: false
			}, { status: 400 });
		}

		// Log error to PocketBase
		try {
			await pb.collection('errors').create({
				message: 'B2B inquiry failed',
				error: error instanceof Error ? error.message : String(error),
				context: 'mailing-list-b2b',
				timestamp: new Date().toISOString()
			});
		} catch (logError) {
			console.error('Failed to log error:', logError);
		}

		return json({
			error: 'Anfrage fehlgeschlagen. Bitte versuche es erneut.'
		}, { status: 500 });
	}
};
