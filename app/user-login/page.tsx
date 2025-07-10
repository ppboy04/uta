"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, LogIn, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function UserLoginPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!whatsappNumber || !dateOfBirth) {
      alert("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          whatsappNumber,
          dateOfBirth,
        }),
      })

      if (response.ok) {
        const userData = await response.json()
        // Redirect to user dashboard with prefilled data
        window.location.href = `/user-dashboard?userId=${userData.user.id}`
      } else {
        alert("Invalid credentials. Please check your WhatsApp number and date of birth.")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center py-8">
      <div className="container mx-auto px-4 max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 text-lg">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">User Login</h1>
            <p className="text-slate-600 text-lg">Access your registration details</p>
          </div>

          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <LogIn className="h-6 w-6" />
                Login to Your Account
              </CardTitle>
              <CardDescription className="text-emerald-100 text-lg">
                Enter your WhatsApp number and date of birth to access your registration
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2 text-lg font-semibold text-slate-700">
                    <Phone className="h-5 w-5" />
                    WhatsApp Number
                  </Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="Enter your WhatsApp number"
                    className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2 text-lg font-semibold text-slate-700">
                    <Calendar className="h-5 w-5" />
                    Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-bold rounded-xl shadow-lg"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-base text-slate-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg">
                    Register here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
