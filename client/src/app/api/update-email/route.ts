import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userId, enabled, email } = body

  if (!userId || typeof enabled !== "boolean" || !email) {
    return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 })
  }

  try {
    const [existing]: unknown[] = await db.execute(
      "SELECT id FROM email_forwarding WHERE user_id = ?",
      [userId]
    )


    if (Array.isArray(existing) && existing.length > 0) {
      // Update if exists
      await db.execute(
        "UPDATE email_forwarding SET is_enabled = ?, forwarding_email = ? WHERE user_id = ?",
        [enabled, email, userId]
      )
    } else {
      // Insert if not exists
      await db.execute(
        "INSERT INTO email_forwarding (user_id, is_enabled, forwarding_email) VALUES (?, ?, ?)",
        [userId, enabled, email]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DB update error:", error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
