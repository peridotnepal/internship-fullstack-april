"use client"

import { useState, useEffect, useRef } from "react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, Check, Loader2, Moon, Pencil, Sun, X } from 'lucide-react'
import { sendOTP, verifyOTP, updateEmailForwarding } from "@/lib/email-service"
import { useTheme } from "next-themes"

// Mock user data
const user = {
  id: 3279,
  user_id: "Fti1eE8ojDOypmtis4UciPVwrkX2",
  user_name: "Kb Bohara",
  first_name: "Kb",
  last_name: "Bohara",
  email: "thekbbohara@gmail.com",
  login_type: "1",
  member_type: "",
  investor_type: "",
  phone_number: "",
  is_subscribed: null,
  promocode: null,
  fcm_token: null,
  is_admin: null,
  is_portfolio_subscribed: 1,
  expAt: "2025-11-17T00:00:00.000Z",
  iat: 1747551356,
  exp: 1748156156,
}

// Theme toggle component
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 border-gray-200 dark:border-gray-800"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}

// Email validation function
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// OTP Input component
type OtpInputProps = {
  value: string
  onChange: (value: string) => void
  length?: number
}

const OtpInput = ({ value, onChange, length = 6 }: OtpInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = [...value]
    newValue[index] = e.target.value
    onChange(newValue.join(""))

    // Auto-focus next input
    if (e.target.value && index < length - 1) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]!.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace to focus previous input
    if (e.key === "Backspace" && !value[index] && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]!.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // If pasted data is the right length and numeric
    if (pastedData.length === length && /^\d+$/.test(pastedData)) {
      onChange(pastedData)
      // Focus the last input
      if (inputRefs.current[length - 1]) {
        inputRefs.current[length - 1]!.focus()
      }
    }
  }

  const inputs = []
  for (let i = 0; i < length; i++) {
    inputs.push(
      <Input
        key={i}
        ref={(el) => { inputRefs.current[i] = el }}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value[i] || ""}
        onChange={(e) => handleChange(e, i)}
        onKeyDown={(e) => handleKeyDown(e, i)}
        onPaste={i === 0 ? handlePaste : undefined}
        className="h-12 w-12 text-center p-0 text-lg"
      />,
    )
  }

  return <div className="flex gap-2 justify-center">{inputs}</div>
}

export default function Home() {
  // const { theme } = useTheme()
  const [isEnabled, setIsEnabled] = useState(false)
  const [forwardingEmail, setForwardingEmail] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [, setIsOtpSent] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [otpDialogOpen, setOtpDialogOpen] = useState(false)
  const [status, setStatus] = useState({ type: "", message: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Simulate fetching email forwarding settings
    setForwardingEmail(user.email)
  }, [])

  useEffect(() => {
    // Handle resend timer countdown
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resendTimer])



  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked)
    if (!checked) {
      setIsEditing(false)
      setIsOtpSent(false)
      setOtpDialogOpen(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setNewEmail(forwardingEmail)
    setStatus({ type: "", message: "" })
  }

  const handleSendOTP = async () => {
    // Validate email first
    if (!isValidEmail(newEmail)) {
      setStatus({ type: "error", message: "Invalid email address" })
      return
    }

    if (newEmail === forwardingEmail) {
      setIsEditing(false)
      return
    }

    setIsLoading(true)
    setStatus({ type: "", message: "" })

    try {
      await sendOTP(newEmail)
      setIsOtpSent(true)
      setOtpDialogOpen(true)
      setStatus({ type: "success", message: "OTP sent to your email" })
      setResendTimer(60) // Start 60 second timer for resend
    } catch {
      setStatus({ type: "error", message: "Failed to send OTP" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)
    setStatus({ type: "", message: "" })

    try {
      await sendOTP(newEmail)
      setStatus({ type: "success", message: "OTP resent to your email" })
      setResendTimer(60) // Reset timer
    } catch {
      setStatus({ type: "error", message: "Failed to resend OTP" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setIsLoading(true)
    setStatus({ type: "", message: "" })

    try {
      const isValid = await verifyOTP(newEmail, otp)

      if (isValid) {
        await updateEmailForwarding(user.id, isEnabled, newEmail)
        setForwardingEmail(newEmail)
        setIsEditing(false)
        setIsOtpSent(false)
        setOtpDialogOpen(false)
        setOtp("")
        setStatus({ type: "", message: "" })
      } else {
        setStatus({ type: "error", message: "Invalid OTP" })
      }
    } catch {
      setStatus({ type: "error", message: "Verification failed" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setIsOtpSent(false)
    setOtpDialogOpen(false)
    setOtp("")
    setStatus({ type: "", message: "" })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full max-w-md relative">
        <div className="absolute top-2 right-2 z-10">
          <ThemeToggle />
        </div>
        
        <Card className="w-full border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700 dark:text-gray-200">Auto-Sync Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 flex-1">
                  {isEnabled ? (
                    isEditing ? (
                      <div className="relative flex-1">
                        <Input
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="h-8 text-sm pr-16 bg-white dark:bg-gray-800"
                          autoFocus
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={handleCancel}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-green-500 dark:text-green-400 hover:text-green-600 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20"
                            onClick={handleSendOTP}
                            disabled={isLoading}
                          >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium dark:text-gray-200">{forwardingEmail}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full text-gray-500 dark:text-gray-400"
                          onClick={handleEdit}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )
                  ) : (
                    <div className="font-medium dark:text-gray-200">Email forwarding</div>
                  )}
                </div>
                <Switch checked={isEnabled} onCheckedChange={handleToggle} aria-label="Toggle email forwarding" className="ml-2"/>
              </div>

              {status.message && !otpDialogOpen && (
                <div
                  className={`text-xs flex items-center gap-1 ${
                    status.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {status.type === "error" ? <AlertCircle className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                  {status.message}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={(open) => !isLoading && setOtpDialogOpen(open)}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Verify Email</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {status.message && (
              <div
                className={`text-sm flex items-center gap-1 ${
                  status.type === "error" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                }`}
              >
                {status.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                {status.message}
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enter the 6-digit code sent to
                <br />
                <span className="font-medium">{newEmail}</span>
              </p>

              <OtpInput value={otp} onChange={setOtp} length={6} />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Didn&apos;t receive the code?{" "}
                {resendTimer > 0 ? (
                  <span>Resend in {resendTimer}s</span>
                ) : (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs"
                    onClick={handleResendOTP}
                    disabled={isLoading || resendTimer > 0}
                  >
                    Resend
                  </Button>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
