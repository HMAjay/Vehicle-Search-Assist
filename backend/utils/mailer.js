// VERCEL_MAIL_URL must be set in Render environment:
// VERCEL_MAIL_URL = https://your-vercel-app.vercel.app/api/send-email

async function sendOtpEmail(toEmail, otp) {
  const response = await fetch(process.env.VERCEL_MAIL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: toEmail, otp }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to send OTP email");
  }
}

module.exports = { sendOtpEmail };