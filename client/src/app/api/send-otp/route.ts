import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { email } = await req.json()

  const EMAIL_USER = process.env.EMAIL_USER
  const EMAIL_PASS = process.env.EMAIL_PASS
  const EMAIL_FROM = process.env.EMAIL_FROM
  console.log("EMAIL_USER:", EMAIL_USER)
  console.log("EMAIL_PASS:", EMAIL_PASS)

  if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    return NextResponse.json({ success: false, error: "Email config error" }, { status: 500 })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

  // Save OTP to DB with expiration
  await db.execute(
    "INSERT INTO otp_codes (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expiresAt]
  )

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
  })

  try {
    
    await transporter.sendMail({
      from: EMAIL_FROM,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}\n\nIt will expire in 5 minutes.`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Email error:", error)
    return NextResponse.json({ success: false, error: "Failed to send OTP" }, { status: 500 })
  }
}
