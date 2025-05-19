import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Handles the POST request to verify the OTP.
 * 
 * @param {Request} req - The incoming request.
 * @returns {Promise<NextResponse>} A JSON response indicating whether the OTP is valid.
 */
export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ valid: false, message: "Email and OTP are required" });
    }

    const [rows]: unknown[] = await db.execute(
      `SELECT * FROM otp_codes 
       WHERE email = ? AND expires_at > NOW() 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [email]
    );

    const otpRecord = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

    if (!otpRecord || otpRecord.otp !== otp) {
      return NextResponse.json({ valid: false, message: "Invalid OTP" });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ valid: false, message: "An error occurred while verifying the OTP" });
  }
}