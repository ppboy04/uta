import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const { userId, partnerSelections } = await request.json()

    if (!userId || !partnerSelections) {
      return NextResponse.json({ error: "User ID and partner selections required" }, { status: 400 })
    }

    // Update each partner selection
    for (const [eventId, partnerId] of Object.entries(partnerSelections)) {
      const partnerIdValue = partnerId === "not-registered" ? null : Number.parseInt(partnerId as string)

      // Get current partner info before updating
      const currentPartnership = await sql`
        SELECT partnerid, eventname FROM tbl_partners 
        WHERE id = ${Number.parseInt(eventId)} AND userid = ${userId}
      `

      if (currentPartnership.length > 0) {
        const currentPartnerId = currentPartnership[0].partnerid
        const eventName = currentPartnership[0].eventname

        // If there was a previous partner, clear their partnership
        if (currentPartnerId && currentPartnerId !== partnerIdValue) {
          await sql`
            UPDATE tbl_partners 
            SET partnerid = NULL
            WHERE userid = ${currentPartnerId} AND eventname = ${eventName} AND partnerid = ${userId}
          `
        }

        // Update the user's partner selection
        await sql`
          UPDATE tbl_partners 
          SET partnerid = ${partnerIdValue}
          WHERE id = ${Number.parseInt(eventId)} AND userid = ${userId}
        `

        // If a new partner was selected, update their entry to point back to this user
        if (partnerIdValue) {
          // Find the partner's entry for this event and update it
          const partnerEntry = await sql`
            SELECT id FROM tbl_partners 
            WHERE userid = ${partnerIdValue} AND eventname = ${eventName}
          `

          if (partnerEntry.length > 0) {
            await sql`
              UPDATE tbl_partners 
              SET partnerid = ${userId}
              WHERE id = ${partnerEntry[0].id}
            `
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating partners:", error)
    return NextResponse.json({ error: "Failed to update partners" }, { status: 500 })
  }
}
