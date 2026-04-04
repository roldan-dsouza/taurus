// sms.mjs
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/**
 * Sends an SMS message via Twilio.
 * @param {string} to   - Recipient phone number (E.164 format, e.g. "+1234567890")
 * @param {string} body - Message text
 * @param {string} [from] - Sender number (defaults to env var)
 * @returns {Promise<string>} Message SID
 */
export async function sendSMS(
  to,
  body,
  from = process.env.TWILIO_PHONE_NUMBER,
) {
  const message = await client.messages.create({ to, from, body });
  console.log(`SMS sent → SID: ${message.sid}`);
  return message.sid;
}
