"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, CheckCircle, AlertCircle, Users, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface SetupResponse {
  success: boolean
  message?: string
  stats?: {
    events: number
    players: number
    partnerships: number
  }
  testCredentials?: {
    userLogin: Array<{ whatsapp: string; dob: string; name: string }>
    adminLogin: { username: string; password: string }
  }
  error?: string
  details?: string
}

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [setupResult, setSetupResult] = useState<SetupResponse | null>(null)
  const [dbStatus, setDbStatus] = useState<any>(null)

  const handleSetupDatabase = async () => {
    setIsLoading(true)
    setSetupResult(null)

    try {
      const response = await fetch("/api/setup-database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()
      setSetupResult(result)
    } catch (error) {
      setSetupResult({
        success: false,
        error: "Failed to setup database",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch("/api/setup-database")
      const result = await response.json()
      setDbStatus(result)
    } catch (error) {
      setDbStatus({ status: "error", error: "Failed to check database status" })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Database Setup</h1>
          <p className="text-slate-600 text-lg">Initialize your tournament database with tables and sample data</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Setup Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Database className="h-6 w-6" />
                  Setup Database
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Create tables and add sample tournament data
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <Button
                      onClick={handleSetupDatabase}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-bold rounded-xl shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Setting up...
                        </>
                      ) : (
                        <>
                          <Settings className="mr-2 h-5 w-5" />
                          Initialize Database
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={checkDatabaseStatus}
                      variant="outline"
                      className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      Check Database Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Status Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  {setupResult?.success ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : setupResult?.error ? (
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  ) : (
                    <Database className="h-6 w-6 text-slate-600" />
                  )}
                  Setup Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {setupResult?.success && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-700 font-semibold">{setupResult.message}</span>
                    </div>

                    {setupResult.stats && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-emerald-50 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-700">{setupResult.stats.events}</div>
                          <div className="text-sm text-emerald-600">Events</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">{setupResult.stats.players}</div>
                          <div className="text-sm text-blue-600">Players</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-700">{setupResult.stats.partnerships}</div>
                          <div className="text-sm text-purple-600">Partnerships</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {setupResult?.error && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      <span className="text-red-700 font-semibold">{setupResult.error}</span>
                    </div>
                    {setupResult.details && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{setupResult.details}</p>
                    )}
                  </div>
                )}

                {dbStatus && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-700 mb-2">Current Database Status:</h4>
                    <Badge variant={dbStatus.status === "connected" ? "default" : "destructive"}>
                      {dbStatus.status}
                    </Badge>
                    {dbStatus.stats && (
                      <div className="mt-2 text-sm text-slate-600">
                        Events: {dbStatus.stats.events} | Players: {dbStatus.stats.players} | Partnerships:{" "}
                        {dbStatus.stats.partnerships}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Test Credentials */}
        {setupResult?.success && setupResult.testCredentials && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="shadow-2xl border-0 bg-white mt-8">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6" />
                  Test Credentials
                </CardTitle>
                <CardDescription className="text-blue-100 text-lg">
                  Use these credentials to test the system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">User Login (WhatsApp + DOB)</h3>
                    <div className="space-y-3">
                      {setupResult.testCredentials.userLogin.map((user, index) => (
                        <div key={index} className="p-3 bg-emerald-50 rounded-lg">
                          <div className="font-medium text-emerald-800">{user.name}</div>
                          <div className="text-sm text-emerald-600">
                            📱 {user.whatsapp} | 📅 {user.dob}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Admin Login</h3>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-blue-800">
                        <div>
                          <strong>Username:</strong> {setupResult.testCredentials.adminLogin.username}
                        </div>
                        <div>
                          <strong>Password:</strong> {setupResult.testCredentials.adminLogin.password}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/">
              <Button variant="outline" className="border-2 border-slate-300 hover:bg-slate-50 bg-transparent">
                Back to Home
              </Button>
            </Link>
            {setupResult?.success && (
              <>
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">Test Registration</Button>
                </Link>
                <Link href="/admin-dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">Admin Dashboard</Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
