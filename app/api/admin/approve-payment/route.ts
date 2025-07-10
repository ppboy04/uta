import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: "Player ID required" }, { status: 400 })
    }

    await sql`
      UPDATE tbl_players 
      SET feeapproved = true
      WHERE id = ${playerId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error approving payment:", error)
    return NextResponse.json({ error: "Failed to approve payment" }, { status: 500 })
  }
}
