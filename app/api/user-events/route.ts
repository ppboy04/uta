import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    await ensureTables()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const result = await sql`
      SELECT 
        p.id,
        p.eventname,
        p2.name as partner_name,
        p.partnerid as partner_id,
        p.ranking
      FROM tbl_partners p
      LEFT JOIN tbl_players p2 ON p.partnerid = p2.id
      WHERE p.userid = ${Number.parseInt(userId)}
      ORDER BY p.eventname
    `

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching user events:", error)
    return NextResponse.json({ error: "Failed to fetch user events" }, { status: 500 })
  }
}
