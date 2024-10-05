import { a as PRIVATE_BREVO_API_KEY } from "../../../../../chunks/private.js";
import { j as json } from "../../../../../chunks/index.js";
const getTemplate = (templateName, locale, formData) => {
  const templates = [
    {
      name: "sendLink",
      subject: locale === "en" ? "You received an Empathy-Link" : "Du hast einen Empathie-Link erhalten",
      content: `<html><body>
      ${locale === "en" ? "Dear " : "Liebe/r "} ${formData.recipientName}, <br />
      ${formData.owner} ${locale === "en" ? " has sent you an Empathy-Link" : " hat Dir einen Empathie-Link geschickt"}. <br /><br />

      <a href="${formData.link}">${locale === "en" ? "Open your Empathy-Link" : "Öffne Deinen Empathie-Link"}</a><br /><br />
      
      Liebe Grüße<br />
      </body></html>`
    }
  ];
  return templates.find((template) => template.name === templateName);
};
const sendMail = async (template, locale, to, formData) => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": PRIVATE_BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      sender: {
        email: "kontakt@empathy-link.de",
        name: `Alex`
      },
      replyTo: {
        email: "kontakt@empathy-link.de",
        name: `Alex`
      },
      to: [{ email: to }],
      subject: getTemplate(template, locale, formData).subject,
      htmlContent: getTemplate(template, locale, formData).content
    })
  });
  if (!response.ok) {
    return "Message could not be sent at this time.";
  }
};
const prerender = false;
async function POST({ request, cookies }) {
  try {
    const body = await request.json();
    sendMail(body.template, body.locale, body.to, {
      owner: body.owner,
      recipientName: body.recipientName,
      link: body.link
    });
    return json({ result: "mail sent" }, { status: 200 });
  } catch (err) {
    console.log("error in sending mail", err);
    return json({ error: err }, { status: 500 });
  }
}
export {
  POST,
  prerender
};
