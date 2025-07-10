"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Trophy, Save, IndianRupee, CheckCircle, Clock, X, Settings, Home, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface PlayerPair {
  id: number
  player1: string
  player2: string
  ranking: number | null
  player1_id: number
  player2_id: number | null
  player1_feepaid: boolean
  player1_feeapproved: boolean
  player1_accommodation: boolean
  player2_feepaid: boolean | null
  player2_feeapproved: boolean | null
  player2_accommodation: boolean | null
}

export default function AdminDashboardPage() {
  const [selectedEvent, setSelectedEvent] = useState("")
  const [playerPairs, setPlayerPairs] = useState<PlayerPair[]>([])
  const [rankings, setRankings] = useState<{ [key: number]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const events = [
    { value: "A", label: "Category A (Open)" },
    { value: "B", label: "Category B (90+ combined)" },
    { value: "C", label: "Category C (105+ combined)" },
    { value: "D", label: "Category D (120+ combined)" },
  ]

  const fetchPlayerPairs = async (eventName: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/players?event=${eventName}`)
      if (response.ok) {
        const data = await response.json()
        setPlayerPairs(data)
        // Initialize rankings state
        const initialRankings: { [key: number]: string } = {}
        data.forEach((pair: PlayerPair) => {
          initialRankings[pair.id] = pair.ranking?.toString() || ""
        })
        setRankings(initialRankings)
      }
    } catch (error) {
      console.error("Error fetching player pairs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleEventChange = (eventName: string) => {
    setSelectedEvent(eventName)
    if (eventName) {
      fetchPlayerPairs(eventName)
    }
  }

  const handleRankingChange = (pairId: number, ranking: string) => {
    setRankings((prev) => ({
      ...prev,
      [pairId]: ranking,
    }))
  }

  const handleSubmitRankings = async () => {
    if (!selectedEvent) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/rankings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: selectedEvent,
          rankings: rankings,
        }),
      })

      if (response.ok) {
        alert("Rankings saved successfully!")
        fetchPlayerPairs(selectedEvent) // Refresh data
      } else {
        alert("Failed to save rankings. Please try again.")
      }
    } catch (error) {
      alert("An error occurred while saving rankings.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleApprovePayment = async (playerId: number, playerName: string) => {
    try {
      const response = await fetch("/api/admin/approve-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playerId }),
      })

      if (response.ok) {
        alert(`Payment approved for ${playerName}!`)
        fetchPlayerPairs(selectedEvent) // Refresh data
      } else {
        alert("Failed to approve payment. Please try again.")
      }
    } catch (error) {
      alert("An error occurred while approving payment.")
    }
  }

  const getPaymentStatus = (feePaid: boolean | null, feeApproved: boolean | null) => {
    if (feeApproved) {
      return { status: "approved", text: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle }
    } else if (feePaid) {
      return { status: "pending", text: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock }
    } else {
      return { status: "unpaid", text: "Unpaid", color: "bg-red-100 text-red-800", icon: X }
    }
  }

  // Calculate fee based on number of events and accommodation
  const calculatePlayerFee = (playerId: number, hasAccommodation: boolean) => {
    // Count how many events this player is registered for
    const playerEvents = playerPairs.filter(
      (pair) => pair.player1_id === playerId || pair.player2_id === playerId,
    ).length

    let baseFee = 0
    if (playerEvents === 1) {
      baseFee = 3000 // ₹3,000 for 1 event
    } else if (playerEvents >= 2) {
      baseFee = 4500 // ₹4,500 for 2 events
    }

    const accommodationFee = hasAccommodation ? 1500 : 0 // ₹1,500 for accommodation
    return baseFee + accommodationFee
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="inline-flex items-center text-cyan-600 hover:text-cyan-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <Link href="/admin-settings">
              <Button
                variant="outline"
                className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin Settings
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600 text-lg">Tournament Management System</p>
        </motion.div>

        {/* Event Selection */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-2xl border-0 bg-white mb-8">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="h-6 w-6" />
                Event Management
              </CardTitle>
              <CardDescription className="text-cyan-100 text-lg">
                Select an event to view and manage player pairs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event" className="text-lg font-semibold">
                    Select Event
                  </Label>
                  <Select value={selectedEvent} onValueChange={handleEventChange}>
                    <SelectTrigger className="w-full md:w-1/2 h-12 text-lg">
                      <SelectValue placeholder="Choose an event category" />
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Player Pairs Table */}
        {selectedEvent && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6" />
                  Player Pairs - Category {selectedEvent}
                </CardTitle>
                <CardDescription className="text-emerald-100 text-lg">
                  Manage rankings, payment approvals, and view accommodation details
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading player pairs...</p>
                  </div>
                ) : playerPairs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600">No player pairs found for this event.</p>
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">S.No</TableHead>
                            <TableHead>Player 1</TableHead>
                            <TableHead>Player 2</TableHead>
                            <TableHead>Fee Details</TableHead>
                            <TableHead>Payment Status</TableHead>
                            <TableHead className="w-32">Ranking</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {playerPairs.map((pair, index) => {
                            const player1Status = getPaymentStatus(pair.player1_feepaid, pair.player1_feeapproved)
                            const player2Status = pair.player2_id
                              ? getPaymentStatus(pair.player2_feepaid, pair.player2_feeapproved)
                              : null

                            const player1Fee = calculatePlayerFee(pair.player1_id, pair.player1_accommodation)
                            const player2Fee = pair.player2_id
                              ? calculatePlayerFee(pair.player2_id, pair.player2_accommodation || false)
                              : 0

                            return (
                              <TableRow key={pair.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="font-medium flex items-center gap-2">
                                      <User className="h-4 w-4 text-slate-500" />
                                      {pair.player1}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <player1Status.icon className="h-4 w-4" />
                                      <Badge className={`${player1Status.color} text-xs`}>{player1Status.text}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Home className="h-3 w-3 text-slate-400" />
                                      <span className="text-xs text-slate-600">
                                        {pair.player1_accommodation ? "Accommodation: Yes" : "Accommodation: No"}
                                      </span>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="font-medium flex items-center gap-2">
                                      {pair.player2 ? (
                                        <>
                                          <User className="h-4 w-4 text-slate-500" />
                                          {pair.player2}
                                        </>
                                      ) : (
                                        <Badge variant="outline" className="text-orange-600">
                                          Partner not registered
                                        </Badge>
                                      )}
                                    </div>
                                    {player2Status && (
                                      <div className="flex items-center gap-2">
                                        <player2Status.icon className="h-4 w-4" />
                                        <Badge className={`${player2Status.color} text-xs`}>{player2Status.text}</Badge>
                                      </div>
                                    )}
                                    {pair.player2_accommodation !== null && (
                                      <div className="flex items-center gap-2">
                                        <Home className="h-3 w-3 text-slate-400" />
                                        <span className="text-xs text-slate-600">
                                          {pair.player2_accommodation ? "Accommodation: Yes" : "Accommodation: No"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <IndianRupee className="h-4 w-4 text-emerald-600" />
                                      <span className="text-sm font-semibold text-slate-700">
                                        P1: ₹{player1Fee.toLocaleString()}
                                      </span>
                                    </div>
                                    {pair.player2 && (
                                      <div className="flex items-center gap-2">
                                        <IndianRupee className="h-4 w-4 text-emerald-600" />
                                        <span className="text-sm font-semibold text-slate-700">
                                          P2: ₹{player2Fee.toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    <div className="text-xs text-slate-500">
                                      Total: ₹{(player1Fee + player2Fee).toLocaleString()}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    {player1Status.status === "pending" && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleApprovePayment(pair.player1_id, pair.player1)}
                                        className="bg-green-600 hover:bg-green-700 text-xs"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approve P1
                                      </Button>
                                    )}
                                    {player2Status?.status === "pending" && pair.player2_id && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleApprovePayment(pair.player2_id!, pair.player2!)}
                                        className="bg-green-600 hover:bg-green-700 text-xs"
                                      >
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Approve P2
                                      </Button>
                                    )}
                                    <div className="text-xs text-slate-600">
                                      {(player1Status.status === "approved" ? 1 : 0) +
                                        (player2Status?.status === "approved" ? 1 : 0)}
                                      /{pair.player2 ? 2 : 1} approved
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    min="1"
                                    placeholder="Rank"
                                    value={rankings[pair.id] || ""}
                                    onChange={(e) => handleRankingChange(pair.id, e.target.value)}
                                    className="w-20"
                                  />
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button
                        onClick={handleSubmitRankings}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 h-12 px-8 text-lg font-semibold"
                      >
                        <Save className="mr-2 h-5 w-5" />
                        {isSaving ? "Saving Rankings..." : "Submit Rankings"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
