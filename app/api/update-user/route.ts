import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const playerData = await request.json()

    await sql`
      UPDATE tbl_players SET
        name = ${playerData.name},
        city = ${playerData.city},
        shirtsize = ${playerData.shirtsize},
        shortsize = ${playerData.shortsize},
        foodpref = ${playerData.foodpref},
        stayyorn = ${playerData.stayyorn},
        feepaid = ${playerData.feepaid}
      WHERE id = ${playerData.id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user data:", error)
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
  }
}
