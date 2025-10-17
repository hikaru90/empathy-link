import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pb } from '$lib/server/pocketbase';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { name, company, companyEmail, message } = await request.json();

		// Validate required fields
		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			return json({ error: 'Name is required' }, { status: 400 });
		}

		if (!company || typeof company !== 'string' || company.trim().length === 0) {
			return json({ error: 'Company is required' }, { status: 400 });
		}

		if (!companyEmail || typeof companyEmail !== 'string') {
			return json({ error: 'Company email is required' }, { status: 400 });
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(companyEmail)) {
			return json({ error: 'Invalid company email format' }, { status: 400 });
		}

		if (!message || typeof message !== 'string' || message.trim().length === 0) {
			return json({ error: 'Message is required' }, { status: 400 });
		}

		// Validate field lengths
		if (name.trim().length > 100) {
			return json({ error: 'Name must be less than 100 characters' }, { status: 400 });
		}

		if (company.trim().length > 200) {
			return json({ error: 'Company name must be less than 200 characters' }, { status: 400 });
		}

		if (message.trim().length > 2000) {
			return json({ error: 'Message must be less than 2000 characters' }, { status: 400 });
		}

		// Check if already submitted
		const existingSubmission = await pb.collection('mailingList').getFirstListItem(
			`type="business" && companyEmail="${companyEmail}"`,
			{ requestKey: null }
		).catch(() => null);

		if (existingSubmission) {
			return json({ 
				message: 'You have already submitted a business inquiry. We will get back to you soon!',
				success: true 
			});
		}

		// Create new business prospect record
		const record = await pb.collection('mailingList').create({
			type: 'business',
			email: companyEmail.toLowerCase().trim(), // Use company email as primary email
			name: name.trim(),
			company: company.trim(),
			companyEmail: companyEmail.toLowerCase().trim(),
			message: message.trim(),
			status: 'active',
			source: 'website'
		});

		// TODO: Send notification email to business team
		// You can add email notification logic here

		return json({ 
			message: 'Thank you for your interest! We will contact you soon.',
			success: true,
			id: record.id
		});

	} catch (error) {
		console.error('Business prospect submission error:', error);
		
		// Log error to PocketBase
		try {
			await pb.collection('errors').create({
				message: 'Business prospect submission failed',
				error: error instanceof Error ? error.message : String(error),
				context: 'mailing-list-business',
				timestamp: new Date().toISOString()
			});
		} catch (logError) {
			console.error('Failed to log error:', logError);
		}

		return json({ 
			error: 'Failed to submit your inquiry. Please try again.' 
		}, { status: 500 });
	}
};
