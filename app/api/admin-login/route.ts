import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"
import crypto from "crypto"

const sql = neon(process.env.DATABASE_URL!)

// Hash password using SHA-256
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables()

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Check if admin credentials table exists and has records
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_admin_credentials (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    const adminCredentials = await sql`
      SELECT username, password_hash FROM tbl_admin_credentials WHERE username = ${username}
    `

    if (adminCredentials.length > 0) {
      // Use stored credentials
      const storedPasswordHash = adminCredentials[0].password_hash
      const inputPasswordHash = hashPassword(password)

      if (inputPasswordHash === storedPasswordHash) {
        return NextResponse.json({ success: true })
      }
    } else {
      // Fall back to default credentials if no custom password is set
      if (username === "admin" && password === "uta2024") {
        return NextResponse.json({
          success: true,
          message: "Please change your default password for security",
          shouldChangePassword: true,
        })
      }
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
