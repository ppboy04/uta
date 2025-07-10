"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface PlayerData {
  name: string
  whatsappNumber: string
  dateOfBirth: string
  city: string
  shirtSize: string
  shortSize: string
  foodPref: string
  stayYorN: boolean
  feePaid: boolean
}

interface EventSelection {
  event1: string
  partner1: string
  event2: string
  partner2: string
}

interface Partner {
  id: number
  name: string
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: "",
    whatsappNumber: "",
    dateOfBirth: "",
    city: "",
    shirtSize: "",
    shortSize: "",
    foodPref: "",
    stayYorN: false,
    feePaid: false,
  })

  const [eventData, setEventData] = useState<EventSelection>({
    event1: "",
    partner1: "",
    event2: "",
    partner2: "",
  })

  const [availablePartners1, setAvailablePartners1] = useState<Partner[]>([])
  const [availablePartners2, setAvailablePartners2] = useState<Partner[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingPartners1, setIsLoadingPartners1] = useState(false)
  const [isLoadingPartners2, setIsLoadingPartners2] = useState(false)

  const events = [
    { value: "A", label: "Category A (Open)" },
    { value: "B", label: "Category B (90+ combined)" },
    { value: "C", label: "Category C (105+ combined)" },
    { value: "D", label: "Category D (120+ combined)" },
  ]

  const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const shortSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const foodPrefs = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"]

  // Fetch available partners when event is selected
  useEffect(() => {
    if (eventData.event1) {
      fetchPartners(eventData.event1, setAvailablePartners1, setIsLoadingPartners1)
    } else {
      setAvailablePartners1([])
    }
  }, [eventData.event1])

  useEffect(() => {
    if (eventData.event2) {
      fetchPartners(eventData.event2, setAvailablePartners2, setIsLoadingPartners2)
    } else {
      setAvailablePartners2([])
    }
  }, [eventData.event2])

  const fetchPartners = async (
    eventName: string,
    setPartners: (partners: Partner[]) => void,
    setLoading: (loading: boolean) => void,
  ) => {
    setLoading(true)
    try {
      // For registration, we don't exclude any user since they're not registered yet
      const response = await fetch(`/api/partners?event=${eventName}`)
      if (response.ok) {
        const partners = await response.json()
        console.log(`Partners for ${eventName}:`, partners) // Debug log
        setPartners(partners)
      } else {
        console.error(`Failed to fetch partners for ${eventName}`)
        setPartners([])
      }
    } catch (error) {
      console.error("Error fetching partners:", error)
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  const handlePlayerDataChange = (field: keyof PlayerData, value: string | boolean) => {
    setPlayerData((prev) => ({ ...prev, [field]: value }))
  }

  const handleEventDataChange = (field: keyof EventSelection, value: string) => {
    setEventData((prev) => ({ ...prev, [field]: value }))

    // Reset partner selection when event changes
    if (field === "event1") {
      setEventData((prev) => ({ ...prev, partner1: "" }))
    }
    if (field === "event2") {
      setEventData((prev) => ({ ...prev, partner2: "" }))
    }
  }

  const validateStep1 = () => {
    return (
      playerData.name &&
      playerData.whatsappNumber &&
      playerData.dateOfBirth &&
      playerData.city &&
      playerData.shirtSize &&
      playerData.shortSize &&
      playerData.foodPref
    )
  }

  const handleSubmit = async () => {
    if (!eventData.event1) {
      alert("Please select at least one event")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerData,
          eventData,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        // Redirect to success page with user data
        window.location.href = `/registration-success?userId=${result.playerId}&name=${encodeURIComponent(playerData.name)}`
      } else {
        const errorData = await response.json()
        alert(`Registration failed: ${errorData.error || "Please try again."}`)
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Tournament Registration</h1>
          <p className="text-slate-600 text-lg">UTA Annual Doubles Tournament 2024</p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${step >= 1 ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-200"}`}
            >
              1
            </div>
            <div className={`w-20 h-2 rounded-full ${step >= 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${step >= 2 ? "bg-emerald-600 text-white shadow-lg" : "bg-gray-200"}`}
            >
              2
            </div>
          </div>
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <User className="h-6 w-6" />
                  Personal Details
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Please fill in your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg font-semibold text-slate-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={playerData.name}
                      onChange={(e) => handlePlayerDataChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-lg font-semibold text-slate-700">
                      WhatsApp Number *
                    </Label>
                    <Input
                      id="whatsapp"
                      value={playerData.whatsappNumber}
                      onChange={(e) => handlePlayerDataChange("whatsappNumber", e.target.value)}
                      placeholder="Enter WhatsApp number"
                      className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-lg font-semibold text-slate-700">
                      Date of Birth *
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={playerData.dateOfBirth}
                      onChange={(e) => handlePlayerDataChange("dateOfBirth", e.target.value)}
                      className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-lg font-semibold text-slate-700">
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={playerData.city}
                      onChange={(e) => handlePlayerDataChange("city", e.target.value)}
                      placeholder="Enter your city"
                      className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="shirtSize" className="text-lg font-semibold text-slate-700">
                      Shirt Size *
                    </Label>
                    <Select
                      value={playerData.shirtSize}
                      onValueChange={(value) => handlePlayerDataChange("shirtSize", value)}
                    >
                      <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Select shirt size" />
                      </SelectTrigger>
                      <SelectContent>
                        {shirtSizes.map((size) => (
                          <SelectItem key={size} value={size} className="text-lg">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortSize" className="text-lg font-semibold text-slate-700">
                      Short Size *
                    </Label>
                    <Select
                      value={playerData.shortSize}
                      onValueChange={(value) => handlePlayerDataChange("shortSize", value)}
                    >
                      <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Select short size" />
                      </SelectTrigger>
                      <SelectContent>
                        {shortSizes.map((size) => (
                          <SelectItem key={size} value={size} className="text-lg">
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="foodPref" className="text-lg font-semibold text-slate-700">
                    Food Preference *
                  </Label>
                  <Select
                    value={playerData.foodPref}
                    onValueChange={(value) => handlePlayerDataChange("foodPref", value)}
                  >
                    <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                      <SelectValue placeholder="Select food preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodPrefs.map((pref) => (
                        <SelectItem key={pref} value={pref} className="text-lg">
                          {pref}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="stay"
                      checked={playerData.stayYorN}
                      onCheckedChange={(checked) => handlePlayerDataChange("stayYorN", checked as boolean)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="stay" className="text-lg text-slate-700">
                      I need accommodation (+₹1,500)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="feePaid"
                      checked={playerData.feePaid}
                      onCheckedChange={(checked) => handlePlayerDataChange("feePaid", checked as boolean)}
                      className="w-5 h-5"
                    />
                    <Label htmlFor="feePaid" className="text-lg text-slate-700">
                      I have paid the entry fees
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!validateStep1()}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-bold rounded-xl shadow-lg"
                >
                  Next: Event Selection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">Event Selection</CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Select your events and partners (max 2 events)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Event 1 */}
                <div className="p-6 border-2 border-emerald-200 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                  <h3 className="font-bold text-emerald-700 mb-6 text-xl">Event 1 (Required)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Select Event *</Label>
                      <Select
                        value={eventData.event1}
                        onValueChange={(value) => handleEventDataChange("event1", value)}
                      >
                        <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                          <SelectValue placeholder="Choose category" />
                        </SelectTrigger>
                        <SelectContent>
                          {events.map((event) => (
                            <SelectItem key={event.value} value={event.value} className="text-lg">
                              {event.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Select Partner *</Label>
                      <Select
                        value={eventData.partner1}
                        onValueChange={(value) => handleEventDataChange("partner1", value)}
                        disabled={!eventData.event1}
                      >
                        <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                          <SelectValue
                            placeholder={
                              isLoadingPartners1
                                ? "Loading partners..."
                                : !eventData.event1
                                  ? "Select event first"
                                  : "Choose partner"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-registered" className="text-lg">
                            Partner not registered yet
                          </SelectItem>
                          {availablePartners1.map((partner) => (
                            <SelectItem key={partner.id} value={partner.id.toString()} className="text-lg">
                              {partner.name}
                            </SelectItem>
                          ))}
                          {!isLoadingPartners1 && eventData.event1 && availablePartners1.length === 0 && (
                            <SelectItem value="no-partners" disabled className="text-lg text-slate-400">
                              No available partners
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {eventData.event1 && !isLoadingPartners1 && (
                        <p className="text-sm text-slate-600">
                          {availablePartners1.length} available partner{availablePartners1.length !== 1 ? "s" : ""}{" "}
                          found
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="p-6 border-2 border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                  <h3 className="font-bold text-blue-700 mb-6 text-xl">Event 2 (Optional)</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Select Event</Label>
                      <Select
                        value={eventData.event2}
                        onValueChange={(value) => handleEventDataChange("event2", value)}
                      >
                        <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500">
                          <SelectValue placeholder="Choose category" />
                        </SelectTrigger>
                        <SelectContent>
                          {events
                            .filter((event) => event.value !== eventData.event1)
                            .map((event) => (
                              <SelectItem key={event.value} value={event.value} className="text-lg">
                                {event.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Select Partner</Label>
                      <Select
                        value={eventData.partner2}
                        onValueChange={(value) => handleEventDataChange("partner2", value)}
                        disabled={!eventData.event2}
                      >
                        <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500">
                          <SelectValue
                            placeholder={
                              isLoadingPartners2
                                ? "Loading partners..."
                                : !eventData.event2
                                  ? "Select event first"
                                  : "Choose partner"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-registered" className="text-lg">
                            Partner not registered yet
                          </SelectItem>
                          {availablePartners2.map((partner) => (
                            <SelectItem key={partner.id} value={partner.id.toString()} className="text-lg">
                              {partner.name}
                            </SelectItem>
                          ))}
                          {!isLoadingPartners2 && eventData.event2 && availablePartners2.length === 0 && (
                            <SelectItem value="no-partners" disabled className="text-lg text-slate-400">
                              No available partners
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {eventData.event2 && !isLoadingPartners2 && (
                        <p className="text-sm text-slate-600">
                          {availablePartners2.length} available partner{availablePartners2.length !== 1 ? "s" : ""}{" "}
                          found
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-14 text-lg font-semibold border-2 border-slate-300 hover:bg-slate-50 rounded-xl"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !eventData.event1}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-bold rounded-xl shadow-lg"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
