"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    }
  }

  const passwordValidation = validatePassword(newPassword)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (!passwordValidation.isValid) {
      setMessage({ type: "error", text: "New password does not meet security requirements" })
      return
    }

    if (newPassword === currentPassword) {
      setMessage({ type: "error", text: "New password must be different from current password" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setMessage({ type: "error", text: result.error || "Failed to change password" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${met ? "text-green-600" : "text-slate-500"}`}>
      <CheckCircle className={`h-4 w-4 ${met ? "text-green-600" : "text-slate-300"}`} />
      <span>{text}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/admin-dashboard" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Settings</h1>
          <p className="text-slate-600 text-lg">Manage your administrator account security</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6" />
                Change Admin Password
              </CardTitle>
              <CardDescription className="text-cyan-100 text-lg">
                Update your admin password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {message && (
                <Alert
                  className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                >
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                      {message.text}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <form onSubmit={handleChangePassword} className="space-y-6">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-lg font-semibold text-slate-700">
                    Current Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="h-12 text-lg border-2 border-slate-200 focus:border-cyan-500 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-lg font-semibold text-slate-700">
                    New Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      className="h-12 text-lg border-2 border-slate-200 focus:border-cyan-500 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Password Requirements */}
                  {newPassword && (
                    <div className="mt-3 p-4 bg-slate-50 rounded-lg space-y-2">
                      <h4 className="font-semibold text-slate-700 mb-2">Password Requirements:</h4>
                      <PasswordRequirement met={passwordValidation.minLength} text="At least 8 characters long" />
                      <PasswordRequirement
                        met={passwordValidation.hasUpperCase}
                        text="Contains uppercase letter (A-Z)"
                      />
                      <PasswordRequirement
                        met={passwordValidation.hasLowerCase}
                        text="Contains lowercase letter (a-z)"
                      />
                      <PasswordRequirement met={passwordValidation.hasNumbers} text="Contains number (0-9)" />
                      <PasswordRequirement
                        met={passwordValidation.hasSpecialChar}
                        text="Contains special character (!@#$%^&*)"
                      />
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-lg font-semibold text-slate-700">
                    Confirm New Password *
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      className="h-12 text-lg border-2 border-slate-200 focus:border-cyan-500 pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>

                {/* Security Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Security Tips
                  </h4>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Use a unique password that you don't use elsewhere</li>
                    <li>• Consider using a password manager</li>
                    <li>• Don't share your admin password with anyone</li>
                    <li>• Change your password regularly</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !passwordValidation.isValid || newPassword !== confirmPassword}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 h-14 text-lg font-bold rounded-xl shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Change Password
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Additional Security Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="shadow-xl border-0 bg-gradient-to-r from-amber-50 to-orange-50 mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-3">🔐 Account Security</h3>
                <p className="text-slate-600 mb-4">
                  Your admin account has access to sensitive tournament data. Keep it secure by using a strong, unique
                  password.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-2">✅ Do</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Use a strong, unique password</li>
                      <li>• Log out when finished</li>
                      <li>• Keep credentials private</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-2">❌ Don't</h4>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• Share your password</li>
                      <li>• Use simple passwords</li>
                      <li>• Leave sessions open</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
