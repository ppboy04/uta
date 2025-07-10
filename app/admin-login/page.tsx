"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Shield, User, Lock, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswordWarning, setShowPasswordWarning] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      alert("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        if (result.shouldChangePassword) {
          setShowPasswordWarning(true)
          // Still redirect to dashboard but show warning
          setTimeout(() => {
            window.location.href = "/admin-dashboard"
          }, 3000)
        } else {
          // Redirect to admin dashboard
          window.location.href = "/admin-dashboard"
        }
      } else {
        alert("Invalid credentials. Please check your username and password.")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-cyan-600 hover:text-cyan-700 mb-4 text-lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Login</h1>
            <p className="text-slate-600 text-lg">Access tournament administration</p>
          </div>

          {showPasswordWarning && (
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Security Notice:</strong> You are using the default password. Please change it immediately after
                login for security. Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Shield className="h-6 w-6" />
                Administrator Access
              </CardTitle>
              <CardDescription className="text-cyan-100 text-lg">
                Enter your admin credentials to manage tournament data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2 text-lg font-semibold text-slate-700">
                    <User className="h-5 w-5" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                    className="h-12 text-lg border-2 border-slate-200 focus:border-cyan-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2 text-lg font-semibold text-slate-700">
                    <Lock className="h-5 w-5" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="h-12 text-lg border-2 border-slate-200 focus:border-cyan-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 h-14 text-lg font-bold rounded-xl shadow-lg"
                >
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </Button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Notice
                </h4>
                <p className="text-blue-700 text-sm">
                  If this is your first login or you're using the default password, please change it immediately after
                  accessing the dashboard.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
