import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, otp } = req.body || {};
  if (!to || !otp) {
    return res.status(400).json({ error: "Missing to or otp" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"VahanConnect" <${process.env.MAIL_USER}>`,
      to,
      subject: "Your VahanConnect OTP",
      html: `
        <div style="font-family:monospace;max-width:420px;margin:0 auto;padding:32px;background:#0d1117;color:#e8edf3;border-radius:12px;">
          <h2 style="color:#f5a623;letter-spacing:0.1em;margin:0 0 8px;">VAHANCONNECT</h2>
          <p style="color:#8b97a8;margin:0 0 24px;font-size:0.9rem;">Your one-time password for registration:</p>
          <div style="font-size:2rem;font-weight:700;letter-spacing:0.4em;color:#f5a623;background:#161d27;padding:20px 24px;border-radius:8px;text-align:center;border:1px solid #2a3d54;">
            ${otp}
          </div>
          <p style="color:#4a5568;font-size:0.75rem;margin:24px 0 0;">
            This OTP expires in 10 minutes.<br/>Do not share it with anyone.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Mail error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
