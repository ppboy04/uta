"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Trophy, Users, Clock, Phone, ExternalLink, MessageCircle, UserCheck } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const rules = [
  "Categories: A (Open), B (90+ combined), C (105+ combined), D (120+ combined), Lucky Doubles. This is Only Doubles Tournament.",
  "Lucky Doubles Format - Any participant who loses both matches in the first round shall be considered for the draw of Lucky Doubles. Any participant who opted for one event and loses in the first round will also be eligible.",
  "Age Limit is 30 years.",
  "The age of any participant shall be calculated as his running age as on 9th December. For example if the participant turns 29 on the 8th December, he can be considered as 30. Please carry your age proof with you.",
  "One player can participate in max 2 categories (excluding lucky doubles which could be the 3rd for any participant).",
  "Coaches are allowed to play in Category A only. Any Individual who earns via tennis coaching shall be defined as Coach.",
  "Entry Fee for two events is ₹4500 (₹6000 with double sharing accommodation of up to 2 days) and one event is ₹3000 (₹4500 with double sharing accommodation of up to 2 days).",
  "Breakfast and Lunch shall be provided on both days and Gala dinner on the 9th December.",
  "Every participant shall get Indian Tree T-Shirt, Shorts, Socks, Cap, Wristband (MRP more than Rs 3000).",
  "Prize money for the winner team is ₹21000 and for the runners up team is ₹11000. Each Semi-Finalist team shall get ₹4000.",
  "Lucky Doubles Prize shall be 50% (₹10500 for winner, ₹5500 for runner up, ₹2000 each for SF).",
  "Last date for entry Fees is 7th December.",
  "No entry fees shall at all be accepted after 7th December.",
  "Draws and Order of Play shall be published on the 8th December.",
  "If any team does not turn up at scheduled time, walk-over shall be given to the opponent within 15 minutes.",
  "Balls for the Tournament shall be Head Tour.",
  "For any query Please contact Tournament Director Sumit Goel (Ph. 9412977857)",
  "Venue of the tournament - Shanti Tennis Academy",
  "Venue for Gala Party and Stay - OM farms, 8-A, Jogiwala, Badripur, Dehradun, Uttarakhand 248005",
  "The Maximum size of the draw in any category is 32.",
  "There are 4 hard courts and 4 additional hard courts at a nearby venue if required.",
  "After registration, do join the participants whatsapp group through the provided link.",
]

export default function HomePage() {
  const [showAllRules, setShowAllRules] = useState(false)
  const [currentRuleIndex, setCurrentRuleIndex] = useState(0)

  // Enhanced sliding animation for rules
  useEffect(() => {
    if (!showAllRules) {
      const interval = setInterval(() => {
        setCurrentRuleIndex((prev) => (prev + 1) % (rules.length - 6))
      }, 4000) // Slower transition for better readability
      return () => clearInterval(interval)
    }
  }, [showAllRules])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=4/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-white"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Uttaranchal Tennis Association
            </motion.h1>
            <motion.p
              className="text-2xl md:text-3xl mb-6 text-emerald-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Annual Doubles Tournament 2024
            </motion.p>
            <motion.div
              className="flex flex-wrap justify-center gap-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <Calendar className="h-6 w-6 text-emerald-200" />
                <span className="font-semibold">8th - 9th December 2024</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <MapPin className="h-6 w-6 text-emerald-200" />
                <span>Shanti Tennis Academy, Dehradun</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Action Buttons */}
      <section className="py-12 bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-10 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                <Users className="mr-3 h-6 w-6" />
                Register Now
              </Button>
            </Link>
            <Link href="/user-login">
              <Button
                size="lg"
                variant="outline"
                className="border-3 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-10 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl bg-white"
              >
                User Login
              </Button>
            </Link>
            <Link href="/admin-login">
              <Button
                size="lg"
                variant="outline"
                className="border-3 border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-10 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl bg-white"
              >
                Admin Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tournament Highlights */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-12"
          >
            Tournament Highlights
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 group-hover:from-yellow-100 group-hover:to-orange-100">
                <CardHeader className="text-center pb-4">
                  <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-2xl text-emerald-700">Prize Money</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-3xl font-bold text-slate-800 mb-3">₹21,000</p>
                  <p className="text-lg text-slate-600 mb-3">Winner Prize</p>
                  <p className="text-xl font-semibold text-slate-700 mb-2">₹11,000 Runner-up</p>
                  <p className="text-base text-slate-600">₹4,000 Semi-finalists</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 group-hover:from-blue-100 group-hover:to-cyan-100">
                <CardHeader className="text-center pb-4">
                  <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                    <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-2xl text-emerald-700">Categories</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300 text-emerald-700">
                      A (Open)
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300 text-emerald-700">
                      B (90+)
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300 text-emerald-700">
                      C (105+)
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300 text-emerald-700">
                      D (120+)
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1 border-emerald-300 text-emerald-700">
                      Lucky Doubles
                    </Badge>
                  </div>
                  <p className="text-base text-slate-600 mt-3">Max 2 categories per player</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-pink-50 group-hover:from-red-100 group-hover:to-pink-100">
                <CardHeader className="text-center pb-4">
                  <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.3 }}>
                    <Clock className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-2xl text-emerald-700">Entry Fee</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-2xl font-bold text-slate-800 mb-2">₹3,000 (1 Event)</p>
                  <p className="text-2xl font-bold text-slate-800 mb-3">₹4,500 (2 Events)</p>
                  <p className="text-base text-slate-600 mb-3">+₹1,500 for accommodation</p>
                  <p className="text-lg text-red-600 font-bold">Deadline: 7th Dec</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rules and Regulations with Sliding Animation */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-12"
          >
            Tournament Rules & Regulations
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-slate-50 to-emerald-50">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Factsheet and Rules</CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Please read all rules carefully before registration
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {showAllRules ? (
                      <motion.div
                        key="all-rules"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                      >
                        {rules.map((rule, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all duration-300 border border-transparent hover:border-emerald-200"
                          >
                            <Badge
                              variant="outline"
                              className="mt-1 min-w-fit bg-emerald-100 text-emerald-700 border-emerald-300"
                            >
                              {index + 1}
                            </Badge>
                            <p className="text-slate-700 leading-relaxed text-lg">{rule}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div key="sliding-rules" className="space-y-4">
                        {rules.slice(0, 6).map((rule, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-all duration-300 border border-transparent hover:border-emerald-200"
                          >
                            <Badge
                              variant="outline"
                              className="mt-1 min-w-fit bg-emerald-100 text-emerald-700 border-emerald-300"
                            >
                              {index + 1}
                            </Badge>
                            <p className="text-slate-700 leading-relaxed text-lg">{rule}</p>
                          </motion.div>
                        ))}

                        {/* Sliding rule preview */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentRuleIndex}
                            initial={{ opacity: 0, x: 100, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -100, scale: 0.95 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 border-2 border-emerald-300 shadow-lg"
                          >
                            <Badge className="mt-1 min-w-fit bg-emerald-600 text-white shadow-md">
                              {currentRuleIndex + 7}
                            </Badge>
                            <p className="text-slate-700 leading-relaxed text-lg font-medium">
                              {rules[currentRuleIndex + 6] || rules[currentRuleIndex]}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="text-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllRules(!showAllRules)}
                    className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 text-lg font-semibold rounded-xl"
                  >
                    {showAllRules ? "Show Preview" : "Show All Rules"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Venue and Links Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-12"
          >
            Important Links
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Venue with Google Maps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                <CardHeader className="text-center">
                  <MapPin className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-800">Tournament Venue</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold text-slate-700 mb-4">Shanti Tennis Academy</p>
                  <div className="mb-4 rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3443.8234567890123!2d78.0516135!3d30.3090678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390929af78d571c3%3A0xce2d2329a1ca3d38!2sShanti%20Tennis%20Academy!5e0!3m2!1sen!2sin!4v1640995200000!5m2!1sen!2sin"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Shanti Tennis Academy Location"
                    />
                  </div>
                  <a
                    href="https://www.google.com/maps/place/Shanti+Tennis+Academy/@30.3090678,78.0538135,17z/data=!3m1!4b1!4m6!3m5!1s0x390929af78d571c3:0xce2d2329a1ca3d38!8m2!3d30.3090678!4d78.0538135!16s%2Fg%2F1261sp337?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View in Google Maps
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                <CardHeader className="text-center">
                  <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-800">Past Participants</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-base text-slate-600 mb-4">View list of registered participants</p>
                  <a
                    href="https://tinyurl.com/UK2023ENTRIES"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View List
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white">
                <CardHeader className="text-center">
                  <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl text-slate-800">WhatsApp Group</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-base text-slate-600 mb-4">Join participants group after registration</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-amber-700 font-medium">🔒 Registration Required</p>
                    <p className="text-xs text-amber-600 mt-1">
                      Complete your tournament registration to access the group
                    </p>
                  </div>
                  <Link href="/register">
                    <button className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 w-full justify-center">
                      <MessageCircle className="h-4 w-4" />
                      Register to Join Group
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23ffffff fillOpacity=0.05%3E%3Ccircle cx=30 cy=30 r=4/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Tournament Director</h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Phone className="h-6 w-6" />
                  <span className="text-xl font-semibold">Sumit Goel</span>
                </div>
                <p className="text-xl">9412977857</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-sm rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Tournament Venue</h3>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MapPin className="h-6 w-6" />
                  <span className="text-xl">Shanti Tennis Academy</span>
                </div>
                <p className="text-lg">Dehradun, Uttarakhand</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }}>
            <h3 className="text-2xl font-bold mb-4">Uttaranchal Tennis Association</h3>
            <p className="text-slate-400 text-lg">© 2024 All rights reserved</p>
            <p className="text-slate-500 mt-2">Professional Tournament Management System</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
