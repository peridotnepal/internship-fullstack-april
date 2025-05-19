export async function sendOTP(email: string) {
  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  if (!res.ok) throw new Error("Failed to send OTP")
}

export async function verifyOTP(email: string, otp: string) {
  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  })

  const data = await res.json()
  return data.valid
}

export async function updateEmailForwarding(userId: number, enabled: boolean, email: string) {
  const res = await fetch("/api/update-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, enabled, email }),
  })

  if (!res.ok) throw new Error("Failed to update email forwarding")
}
