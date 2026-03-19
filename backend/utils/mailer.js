const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendOtpEmail(toEmail, otp) {
  await transporter.sendMail({
    from: `"VahanConnect" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "Your VahanConnect Account OTP",
    html: `
      <div style="font-family:monospace;max-width:400px;margin:0 auto;padding:32px;background:#0d1117;color:#e8edf3;border-radius:12px;">
        <h2 style="color:#f5a623;letter-spacing:0.1em;margin-bottom:8px;">VAHANCONNECT</h2>
        <p style="color:#8b97a8;margin-bottom:24px;">Your one-time password for registration:</p>
        <div style="font-size:2rem;font-weight:700;letter-spacing:0.3em;color:#f5a623;background:#161d27;padding:16px 24px;border-radius:8px;text-align:center;border:1px solid #2a3d54;">
          ${otp}
        </div>
        <p style="color:#4a5568;font-size:0.8rem;margin-top:24px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };