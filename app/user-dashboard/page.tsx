"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Edit, Save, Trophy, CheckCircle, Clock, X, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface PlayerData {
  id: number
  name: string
  whatsappnumber: string
  dateofbirth: string
  city: string
  shirtsize: string
  shortsize: string
  foodpref: string
  stayyorn: boolean
  feepaid: boolean
  feeapproved: boolean
}

interface EventRegistration {
  id: number
  eventname: string
  partner_name: string | null
  partner_id: number | null
  ranking: number | null
}

interface Partner {
  id: number
  name: string
}

export default function UserDashboardPage() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null)
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([])
  const [availablePartners, setAvailablePartners] = useState<{ [key: string]: Partner[] }>({})
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingEvents, setIsEditingEvents] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [partnerSelections, setPartnerSelections] = useState<{ [key: number]: string }>({})
  const [eventSelections, setEventSelections] = useState<{ [key: number]: { event: string; partner: string } }>({})
  const [newEvent, setNewEvent] = useState({ event: "", partner: "" })

  const shirtSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const shortSizes = ["XS", "S", "M", "L", "XL", "XXL"]
  const foodPrefs = ["Vegetarian", "Non-Vegetarian", "Vegan", "Jain"]

  const events = [
    { value: "A", label: "Category A (Open)" },
    { value: "B", label: "Category B (90+ combined)" },
    { value: "C", label: "Category C (105+ combined)" },
    { value: "D", label: "Category D (120+ combined)" },
  ]

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const userId = urlParams.get("userId")

    if (userId) {
      fetchUserData(userId)
      fetchEventRegistrations(userId)
    } else {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Fetch available partners for each event when editing
    if (isEditingEvents && eventRegistrations.length > 0) {
      eventRegistrations.forEach((event) => {
        fetchPartners(event.eventname)
      })
      // Also fetch for new event if selected
      if (newEvent.event) {
        fetchPartners(newEvent.event)
      }
    }
  }, [isEditingEvents, eventRegistrations, newEvent.event])

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-data?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPlayerData(data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEventRegistrations = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-events?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setEventRegistrations(data)
        // Initialize selections
        const initialPartnerSelections: { [key: number]: string } = {}
        const initialEventSelections: { [key: number]: { event: string; partner: string } } = {}
        data.forEach((event: EventRegistration) => {
          initialPartnerSelections[event.id] = event.partner_id?.toString() || "not-registered"
          initialEventSelections[event.id] = {
            event: event.eventname,
            partner: event.partner_id?.toString() || "not-registered",
          }
        })
        setPartnerSelections(initialPartnerSelections)
        setEventSelections(initialEventSelections)
      }
    } catch (error) {
      console.error("Error fetching event registrations:", error)
    }
  }

  const fetchPartners = async (eventName: string) => {
    try {
      const response = await fetch(`/api/partners?event=${eventName}&excludeUserId=${playerData?.id}`)
      if (response.ok) {
        const partners = await response.json()
        setAvailablePartners((prev) => ({
          ...prev,
          [eventName]: partners,
        }))
      }
    } catch (error) {
      console.error("Error fetching partners:", error)
    }
  }

  const handleDataChange = (field: keyof PlayerData, value: string | boolean) => {
    if (playerData) {
      setPlayerData({ ...playerData, [field]: value })
    }
  }

  const handleEventChange = (eventId: number, field: "event" | "partner", value: string) => {
    setEventSelections((prev) => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value,
      },
    }))

    // If event changed, reset partner and fetch new partners
    if (field === "event") {
      setEventSelections((prev) => ({
        ...prev,
        [eventId]: {
          event: value,
          partner: "not-registered",
        },
      }))
      fetchPartners(value)
    }
  }

  const handleNewEventChange = (field: "event" | "partner", value: string) => {
    setNewEvent((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (field === "event" && value) {
      setNewEvent((prev) => ({ ...prev, partner: "not-registered" }))
      fetchPartners(value)
    }
  }

  const handleAddEvent = () => {
    if (!newEvent.event || eventRegistrations.length >= 2) return

    // Check if event already exists
    const eventExists = eventRegistrations.some((reg) => reg.eventname === newEvent.event)
    if (eventExists) {
      alert("You are already registered for this event category.")
      return
    }

    // Add to temporary state (will be saved when user clicks save)
    const tempId = Date.now() // Temporary ID for new event
    const newRegistration: EventRegistration = {
      id: tempId,
      eventname: newEvent.event,
      partner_name:
        newEvent.partner === "not-registered"
          ? null
          : availablePartners[newEvent.event]?.find((p) => p.id.toString() === newEvent.partner)?.name || null,
      partner_id: newEvent.partner === "not-registered" ? null : Number.parseInt(newEvent.partner),
      ranking: null,
    }

    setEventRegistrations((prev) => [...prev, newRegistration])
    setEventSelections((prev) => ({
      ...prev,
      [tempId]: {
        event: newEvent.event,
        partner: newEvent.partner,
      },
    }))

    setNewEvent({ event: "", partner: "" })
  }

  const handleRemoveEvent = (eventId: number) => {
    setEventRegistrations((prev) => prev.filter((event) => event.id !== eventId))
    setEventSelections((prev) => {
      const newSelections = { ...prev }
      delete newSelections[eventId]
      return newSelections
    })
  }

  const handleSave = async () => {
    if (!playerData) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerData),
      })

      if (response.ok) {
        alert("Details updated successfully!")
        setIsEditing(false)
        fetchUserData(playerData.id.toString())
      } else {
        alert("Failed to update details. Please try again.")
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEvents = async () => {
    if (!playerData) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/update-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: playerData.id,
          eventSelections,
        }),
      })

      if (response.ok) {
        alert("Events updated successfully!")
        setIsEditingEvents(false)
        fetchEventRegistrations(playerData.id.toString())
      } else {
        const errorData = await response.json()
        alert(`Failed to update events: ${errorData.error || "Please try again."}`)
      }
    } catch (error) {
      alert("An error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const getPaymentStatus = () => {
    if (!playerData) return null

    if (playerData.feeapproved) {
      return { status: "approved", text: "Payment Approved", color: "bg-green-100 text-green-800", icon: CheckCircle }
    } else if (playerData.feepaid) {
      return {
        status: "pending",
        text: "Payment Pending Approval",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      }
    } else {
      return { status: "unpaid", text: "Payment Not Made", color: "bg-red-100 text-red-800", icon: X }
    }
  }

  const getAvailableEvents = () => {
    const registeredEvents = eventRegistrations.map((reg) => reg.eventname)
    return events.filter((event) => !registeredEvents.includes(event.value))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your details...</p>
        </div>
      </div>
    )
  }

  if (!playerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <Card className="shadow-xl max-w-md">
          <CardContent className="text-center p-8">
            <p className="text-slate-600 text-lg mb-4">User not found or invalid session.</p>
            <Link href="/user-login">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const paymentStatus = getPaymentStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 text-lg">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Your Registration Details</h1>
          <p className="text-slate-600 text-lg">UTA Annual Doubles Tournament 2024</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Personal Details */}
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-2xl border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center justify-between text-2xl">
                    <div className="flex items-center gap-2">
                      <User className="h-6 w-6" />
                      Personal Details
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-emerald-100 text-lg">
                    {isEditing ? "Edit your registration information" : "View your registration information"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Full Name</Label>
                      {isEditing ? (
                        <Input
                          value={playerData.name}
                          onChange={(e) => handleDataChange("name", e.target.value)}
                          className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                        />
                      ) : (
                        <p className="text-lg text-slate-600 bg-slate-50 p-3 rounded-lg">{playerData.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">WhatsApp Number</Label>
                      <p className="text-lg text-slate-600 bg-slate-50 p-3 rounded-lg">{playerData.whatsappnumber}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Date of Birth</Label>
                      <p className="text-lg text-slate-600 bg-slate-50 p-3 rounded-lg">{playerData.dateofbirth}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">City</Label>
                      {isEditing ? (
                        <Input
                          value={playerData.city}
                          onChange={(e) => handleDataChange("city", e.target.value)}
                          className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500"
                        />
                      ) : (
                        <p className="text-lg text-slate-600 bg-slate-50 p-3 rounded-lg">{playerData.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Shirt Size</Label>
                      {isEditing ? (
                        <Select
                          value={playerData.shirtsize}
                          onValueChange={(value) => handleDataChange("shirtsize", value)}
                        >
                          <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {shirtSizes.map((size) => (
                              <SelectItem key={size} value={size} className="text-lg">
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-lg text-slate-600 bg-slate-50 p-3 rounded-lg">{playerData.shirtsize}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-slate-700">Short Size</Label>
                      {isEditing ? (
                        <Select
                          value={playerData.shortsize}
                          onValueChange={(value) => handleDataChange("shortsize", value)}
                        >
                          <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {shortSizes.map((size) => (
                              <SelectItem key={size} value={size} className="text-lg">
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-lg text-slate-600 bg-slate-50 p-3 rounded-lg">{playerData.shortsize}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold text-slate-700">Food Preference</Label>
                    {isEditing ? (
                      <Select
                        value={playerData.foodpref}
                        onValueChange={(value) => handleDataChange("foodpref", value)}
                      >
                        <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-emerald-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {foodPrefs.map((pref) => (
                            <SelectItem key={pref} value={pref} className="text-lg">
                              {pref}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-lg text-slate-600 bg-slate-50 p-3 rounded-lg">{playerData.foodpref}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {isEditing ? (
                        <Checkbox
                          checked={playerData.stayyorn}
                          onCheckedChange={(checked) => handleDataChange("stayyorn", checked as boolean)}
                          className="w-5 h-5"
                        />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${playerData.stayyorn ? "bg-emerald-600 border-emerald-600" : "border-slate-300"}`}
                        >
                          {playerData.stayyorn && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                        </div>
                      )}
                      <Label className="text-lg text-slate-700">Accommodation Required (+₹1,500)</Label>
                    </div>

                    <div className="flex items-center space-x-3">
                      {isEditing ? (
                        <Checkbox
                          checked={playerData.feepaid}
                          onCheckedChange={(checked) => handleDataChange("feepaid", checked as boolean)}
                          className="w-5 h-5"
                        />
                      ) : (
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${playerData.feepaid ? "bg-emerald-600 border-emerald-600" : "border-slate-300"}`}
                        >
                          {playerData.feepaid && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                        </div>
                      )}
                      <Label className="text-lg text-slate-700">I have paid the entry fees</Label>
                    </div>
                  </div>

                  {isEditing && (
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-14 text-lg font-bold rounded-xl shadow-lg"
                    >
                      <Save className="mr-2 h-5 w-5" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Payment Status & Event Registrations */}
          <div className="space-y-6">
            {/* Payment Status */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-800">Payment Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentStatus && (
                    <div className="flex items-center gap-3">
                      <paymentStatus.icon className="h-6 w-6" />
                      <Badge className={`${paymentStatus.color} text-lg px-4 py-2`}>{paymentStatus.text}</Badge>
                    </div>
                  )}
                  {paymentStatus?.status === "pending" && (
                    <p className="text-sm text-slate-600 mt-3">
                      Your payment is under review by the admin. You will be notified once approved.
                    </p>
                  )}
                  {paymentStatus?.status === "unpaid" && (
                    <p className="text-sm text-slate-600 mt-3">Please make the payment and update your status above.</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Event Registrations */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="shadow-xl border-0 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-xl text-slate-800">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Your Events
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditingEvents(!isEditingEvents)}
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditingEvents ? "Cancel" : "Edit Events"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventRegistrations.length === 0 ? (
                    <p className="text-slate-600">No event registrations found.</p>
                  ) : (
                    <div className="space-y-4">
                      {eventRegistrations.map((event) => (
                        <div key={event.id} className="p-4 border border-slate-200 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-slate-800">
                              {isEditingEvents ? (
                                <Select
                                  value={eventSelections[event.id]?.event || event.eventname}
                                  onValueChange={(value) => handleEventChange(event.id, "event", value)}
                                >
                                  <SelectTrigger className="w-48">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {events.map((evt) => (
                                      <SelectItem key={evt.value} value={evt.value}>
                                        {evt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                `Category ${event.eventname}`
                              )}
                            </h3>
                            <div className="flex items-center gap-2">
                              {event.ranking && (
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                                  Rank #{event.ranking}
                                </Badge>
                              )}
                              {isEditingEvents && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRemoveEvent(event.id)}
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          {isEditingEvents ? (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700">Select Partner</Label>
                              <Select
                                value={eventSelections[event.id]?.partner || "not-registered"}
                                onValueChange={(value) => handleEventChange(event.id, "partner", value)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Choose partner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-registered">Partner not registered yet</SelectItem>
                                  {availablePartners[eventSelections[event.id]?.event || event.eventname]?.map(
                                    (partner) => (
                                      <SelectItem key={partner.id} value={partner.id.toString()}>
                                        {partner.name}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          ) : (
                            <p className="text-sm text-slate-600">
                              Partner: {event.partner_name || "Looking for partner"}
                            </p>
                          )}
                        </div>
                      ))}

                      {/* Add New Event */}
                      {isEditingEvents && eventRegistrations.length < 2 && (
                        <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Add Another Event
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700">Select Event</Label>
                              <Select
                                value={newEvent.event}
                                onValueChange={(value) => handleNewEventChange("event", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableEvents().map((evt) => (
                                    <SelectItem key={evt.value} value={evt.value}>
                                      {evt.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-slate-700">Select Partner</Label>
                              <Select
                                value={newEvent.partner}
                                onValueChange={(value) => handleNewEventChange("partner", value)}
                                disabled={!newEvent.event}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose partner" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-registered">Partner not registered yet</SelectItem>
                                  {availablePartners[newEvent.event]?.map((partner) => (
                                    <SelectItem key={partner.id} value={partner.id.toString()}>
                                      {partner.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button
                            onClick={handleAddEvent}
                            disabled={!newEvent.event}
                            className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Event
                          </Button>
                        </div>
                      )}

                      {isEditingEvents && (
                        <Button
                          onClick={handleSaveEvents}
                          disabled={isSaving}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg font-semibold rounded-xl shadow-lg"
                        >
                          <Save className="mr-2 h-5 w-5" />
                          {isSaving ? "Saving Events..." : "Save Event Changes"}
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
