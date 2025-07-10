import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"
import crypto from "crypto"

const sql = neon(process.env.DATABASE_URL!)

// Hash password using SHA-256 (in production, use bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// Validate password strength
function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureTables()

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current password and new password are required" }, { status: 400 })
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          error: "Password does not meet security requirements",
          details: passwordValidation.errors,
        },
        { status: 400 },
      )
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: "New password must be different from current password" }, { status: 400 })
    }

    // Create admin credentials table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_admin_credentials (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password_hash VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Get current admin credentials
    const adminCredentials = await sql`
      SELECT username, password_hash FROM tbl_admin_credentials WHERE username = 'admin'
    `

    let currentPasswordHash: string

    if (adminCredentials.length === 0) {
      // No admin record exists, check against default password
      if (currentPassword !== "uta2024") {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
      }

      // Create initial admin record with new password
      const newPasswordHash = hashPassword(newPassword)
      await sql`
        INSERT INTO tbl_admin_credentials (username, password_hash)
        VALUES ('admin', ${newPasswordHash})
      `

      return NextResponse.json({
        success: true,
        message: "Admin password set successfully! Please use your new password for future logins.",
      })
    } else {
      // Admin record exists, verify current password
      currentPasswordHash = adminCredentials[0].password_hash
      const inputPasswordHash = hashPassword(currentPassword)

      if (inputPasswordHash !== currentPasswordHash) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 })
      }
    }

    // Update password
    const newPasswordHash = hashPassword(newPassword)
    await sql`
      UPDATE tbl_admin_credentials 
      SET password_hash = ${newPasswordHash}, updated_at = CURRENT_TIMESTAMP
      WHERE username = 'admin'
    `

    return NextResponse.json({
      success: true,
      message: "Password changed successfully!",
    })
  } catch (error) {
    console.error("Error changing admin password:", error)
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 })
  }
}
