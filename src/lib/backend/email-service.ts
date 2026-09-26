import nodemailer from "nodemailer";

interface SendOtpOptions {
  email: string;
  code: string;
  type?: "verification" | "password_reset" | "email_change";
}

export async function sendOtpEmail({ email, code, type = "verification" }: SendOtpOptions): Promise<{ success: boolean; sentRealEmail: boolean; code: string }> {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const from = process.env.EMAIL_FROM || user || '"Elevate Exam Platform" <noreply@exam-platform.com>';

  const subject = 
    type === "password_reset" ? "Reset Your Password - Elevate Exam App" :
    type === "email_change" ? "Confirm Email Change - Elevate Exam App" :
    "Your Verification Code - Elevate Exam App";

  console.log(`\n===========================================================`);
  console.log(`[OTP DISPATCH] Recipient: ${email}`);
  console.log(`[OTP DISPATCH] Code: ${code} (${type})`);

  if (!user || !pass) {
    console.log(`[NOTE] SMTP credentials not set (SMTP_USER / SMTP_PASS).`);
    console.log(`[NOTE] Showing OTP code in application UI & response payload.`);
    console.log(`===========================================================\n`);
    return { success: true, sentRealEmail: false, code };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #2563eb; font-size: 26px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Elevate</h1>
          <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Exam & Learning Platform</p>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <p style="color: #334155; font-size: 15px; line-height: 1.5; margin: 0 0 12px 0;">Hello,</p>
          <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0;">
            Use the following 6-digit verification code to complete your request:
          </p>
          
          <div style="background: #ffffff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
            <span style="font-family: monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8;">${code}</span>
          </div>
          
          <p style="color: #64748b; font-size: 12px; margin: 0; text-align: center;">
            This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
          </p>
        </div>

        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          If you did not make this request, you can safely ignore this email.
        </p>
      </div>
    `;

    await transporter.sendMail({
      from,
      to: email,
      subject,
      text: `Your Elevate verification code is: ${code}`,
      html,
    });

    console.log(`[EMAIL SENT] Successfully sent real email to ${email}`);
    console.log(`===========================================================\n`);
    return { success: true, sentRealEmail: true, code };
  } catch (err: any) {
    console.error(`[EMAIL FAILED] Error sending email via SMTP:`, err.message);
    console.log(`[FALLBACK] Using OTP in app UI: ${code}`);
    console.log(`===========================================================\n`);
    return { success: true, sentRealEmail: false, code };
  }
}
