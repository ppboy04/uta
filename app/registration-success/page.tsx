"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MessageCircle, User, Trophy, ExternalLink, ArrowRight, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function RegistrationSuccessPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const nameParam = urlParams.get("name")
    const userIdParam = urlParams.get("userId")

    if (nameParam) setUserName(decodeURIComponent(nameParam))
    if (userIdParam) setUserId(userIdParam)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">Registration Successful! 🎾</h1>
          <p className="text-xl text-slate-600">Welcome to UTA Annual Doubles Tournament 2024, {userName}!</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* What's Next */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="shadow-2xl border-0 bg-white h-full">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="h-6 w-6" />
                  What's Next?
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Your next steps for the tournament
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Registration Complete ✅</h3>
                      <p className="text-slate-600">Your tournament registration has been successfully submitted.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Join WhatsApp Group 📱</h3>
                      <p className="text-slate-600">Connect with other participants and get tournament updates.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-amber-600 text-white rounded-full text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Manage Your Registration</h3>
                      <p className="text-slate-600">Login anytime to update your details or change partners.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 mb-1">Tournament Day</h3>
                      <p className="text-slate-600">8th-9th December 2024 at Shanti Tennis Academy, Dehradun.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* WhatsApp Group Invitation */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 h-full">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <MessageCircle className="h-6 w-6" />
                  Join Our WhatsApp Group
                </CardTitle>
                <CardDescription className="text-green-100 text-lg">
                  Stay connected with fellow participants
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                    >
                      <MessageCircle className="h-8 w-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">🎉 You're Now Eligible!</h3>
                    <p className="text-slate-600 mb-4">
                      As a registered participant, you can now join our exclusive WhatsApp group.
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-6 border border-green-200">
                    <h4 className="font-semibold text-slate-800 mb-3">Group Benefits:</h4>
                    <ul className="space-y-2 text-slate-600">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="w-2 h-2 p-0 bg-green-500 border-green-500"></Badge>
                        Tournament updates and announcements
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="w-2 h-2 p-0 bg-green-500 border-green-500"></Badge>
                        Connect with other participants
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="w-2 h-2 p-0 bg-green-500 border-green-500"></Badge>
                        Draw announcements on 8th December
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="w-2 h-2 p-0 bg-green-500 border-green-500"></Badge>
                        Real-time tournament information
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline" className="w-2 h-2 p-0 bg-green-500 border-green-500"></Badge>
                        Coordinate with your partner
                      </li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <a
                      href="https://chat.whatsapp.com/JTvbjXSOolF7KI5ORr46DY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <MessageCircle className="h-6 w-6" />
                      Join WhatsApp Group
                      <ExternalLink className="h-5 w-5" />
                    </a>
                    <p className="text-sm text-slate-500 mt-3">Click to open WhatsApp and join the group</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="flex flex-wrap justify-center gap-6 mt-12"
        >
          {userId && (
            <Link href={`/user-dashboard?userId=${userId}`}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <User className="mr-3 h-5 w-5" />
                Manage Registration
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}

          <Link href="/">
            <Button
              size="lg"
              variant="outline"
              className="border-3 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl bg-white"
            >
              <Home className="mr-3 h-5 w-5" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-12"
        >
          <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Important Reminders</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-2">📅 Tournament Dates</h4>
                    <p className="text-slate-600">8th - 9th December 2024</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-2">💰 Fee Deadline</h4>
                    <p className="text-slate-600">7th December 2024</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-2">📋 Draw Publication</h4>
                    <p className="text-slate-600">8th December 2024</p>
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
