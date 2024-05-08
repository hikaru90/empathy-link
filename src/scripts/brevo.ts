import { PUBLIC_BREVO_API_KEY } from '$env/static/public';

const getTemplate = (templateName: string, locale: string, formData: object) => {
	const templates = [
		{
			name: 'sendLink',
			subject: locale === 'en' ? 'You received an Empathy-Link' : 'Du hast einen Empathie-Link erhalten',
			content: `<html><body>
      ${locale === 'en' ? 'Dear ' : 'Liebe/r '} ${formData.recipientName}, <br />
      ${formData.owner} ${locale === 'en' ? ' has sent you an Empathy-Link' : ' hat Dir einen Empathie-Link geschickt'}. <br /><br />

      <a href="${formData.link}">${ locale === 'en' ? 'Open your Empathy-Link' : 'Öffne Deinen Empathie-Link'}</a><br /><br />
      
      Liebe Grüße<br />
      </body></html>`
		},
	];

	return templates.find((template) => template.name === templateName);
};

export const sendMail = async (template: string, locale: string, to: string, formData: object) => {
	const response = await fetch('https://api.brevo.com/v3/smtp/email', {
		method: 'POST',
		headers: {
			accept: 'application/json',
			'api-key': PUBLIC_BREVO_API_KEY,
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			sender: {
				email: 'kontakt@empathy-link.de',
				name: `Alex`
			},
			replyTo: {
				email: 'kontakt@empathy-link.de',
				name: `Alex`
			},
			to: [{ email: to }],
			subject: getTemplate(template, locale, formData).subject,
			htmlContent: getTemplate(template, locale, formData).content
		})
	});

	if (!response.ok) {
		return 'Message could not be sent at this time.';
	}
};
