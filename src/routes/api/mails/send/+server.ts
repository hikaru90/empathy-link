import { sendMail } from '$scripts/brevo';
import { json } from '@sveltejs/kit';

export const prerender = false;

interface Request {
  template: string,
  locale: string,
  to: string,
  owner: string,
  recipientName: string,
  link: string,
}

export async function POST({ request, cookies }) {
  try{
    const body: Request = await request.json();

    sendMail(body.template, body.locale, body.to, {
      owner: body.owner,
      recipientName: body.recipientName,
      link: body.link
    });

    return json({ result: 'mail sent' }, { status: 200 });
  }catch(err){
    console.log('error in sending mail', err);
    return json({ error: err }, { status: 500 });
  }
}
