import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    await ensureTables() // 👈 guarantees the schema exists
    // extra safety – cheap if table already exists
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_players (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        whatsappnumber VARCHAR(20),
        dateofbirth DATE,
        city VARCHAR(100),
        shirtsize VARCHAR(10),
        shortsize VARCHAR(10),
        foodpref VARCHAR(50),
        stayyorn BOOLEAN,
        feepaid  BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    const { whatsappNumber, dateOfBirth } = await request.json()

    const result = await sql`
      SELECT * FROM tbl_players 
      WHERE whatsappnumber = ${whatsappNumber} AND dateofbirth = ${dateOfBirth}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: result[0] })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
