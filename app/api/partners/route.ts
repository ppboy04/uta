import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    await ensureTables()

    const { searchParams } = new URL(request.url)
    const event = searchParams.get("event")
    const excludeUserId = searchParams.get("excludeUserId")

    if (!event) {
      return NextResponse.json({ error: "Event parameter required" }, { status: 400 })
    }

    // Get players registered for this event who don't have a partner assigned
    // OR whose current partner is the user we're excluding (for editing existing partnerships)
    let query

    if (excludeUserId) {
      // For user dashboard - show unassigned partners + current partner
      query = sql`
        SELECT DISTINCT p.id, p.name
        FROM tbl_players AS p
        JOIN tbl_partners AS t ON p.id = t.userid
        WHERE t.eventname = ${event} 
        AND p.id != ${Number.parseInt(excludeUserId)}
        AND (
          t.partnerid IS NULL 
          OR t.partnerid = ${Number.parseInt(excludeUserId)}
        )
        ORDER BY p.name
      `
    } else {
      // For registration - only show completely unassigned partners
      query = sql`
        SELECT DISTINCT p.id, p.name
        FROM tbl_players AS p
        JOIN tbl_partners AS t ON p.id = t.userid
        WHERE t.eventname = ${event} 
        AND t.partnerid IS NULL
        ORDER BY p.name
      `
    }

    const partners = await query
    return NextResponse.json(partners)
  } catch (error) {
    console.error("Error fetching partners:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}
