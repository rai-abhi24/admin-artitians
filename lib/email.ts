import nodemailer from "nodemailer";

const SMTP_MAIL_SERVICE = process.env.SMTP_MAIL_SERVICE as string;
const SMTP_USER = process.env.SMTP_USER as string;
const SMTP_PASS = process.env.SMTP_PASS as string;
const MAIL_FROM = process.env.MAIL_FROM || "sales@cgpey.com";

export function getTransport() {
  const transport = nodemailer.createTransport({
    service: SMTP_MAIL_SERVICE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transport;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const transport = getTransport();
  const info = await transport.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    html,
  });

  if (info.rejected.length) {
    throw new Error(`Failed to send email to ${to}: ${info.rejected.join(", ")}`);
  }

  if (info.accepted.length) {
    console.log(`Email sent successfully to ${to}`);
  }
}
