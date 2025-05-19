"use server"
import nodemailer from "nodemailer"


// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "user",
    pass: process.env.SMTP_PASSWORD || "password",
  },
})

// Send OTP email
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Email Forwarding Service" <no-reply@example.com>',
      to: email,
      subject: "Email Forwarding Verification",
      text: `Your OTP for email forwarding verification is: ${otp}. This OTP will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Forwarding Verification</h2>
          <p>Your OTP for email forwarding verification is:</p>
          <div style="background-color: #f4f4f4; padding: 10px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This OTP will expire in 15 minutes.</p>
        </div>
      `,
    })

    return true
  } catch (error) {
    console.error("Error sending OTP email:", error)
    return false
  }
}
