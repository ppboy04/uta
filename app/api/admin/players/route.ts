import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    await ensureTables()
    const { searchParams } = new URL(request.url)
    const event = searchParams.get("event")

    if (!event) {
      return NextResponse.json({ error: "Event parameter required" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        p1.id,
        p1.eventname,
        u1.name as player1,
        u2.name as player2,
        p1.ranking,
        u1.id as player1_id,
        u2.id as player2_id,
        u1.feepaid as player1_feepaid,
        COALESCE(u1.feeapproved, false) as player1_feeapproved,
        u1.stayyorn as player1_accommodation,
        u2.feepaid as player2_feepaid,
        COALESCE(u2.feeapproved, false) as player2_feeapproved,
        u2.stayyorn as player2_accommodation
      FROM tbl_partners p1
      LEFT JOIN tbl_players u1 ON p1.userid = u1.id
      LEFT JOIN tbl_players u2 ON p1.partnerid = u2.id
      WHERE p1.eventname = ${event}
      ORDER BY p1.id
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}
