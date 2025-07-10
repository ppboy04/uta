import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const { event, rankings } = await request.json()

    // Update rankings for each pair
    for (const [pairId, ranking] of Object.entries(rankings)) {
      if (ranking && ranking !== "") {
        await sql`
          UPDATE tbl_partners 
          SET ranking = ${Number.parseInt(ranking as string)}
          WHERE id = ${Number.parseInt(pairId)} AND eventname = ${event}
        `
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating rankings:", error)
    return NextResponse.json({ error: "Failed to update rankings" }, { status: 500 })
  }
}
