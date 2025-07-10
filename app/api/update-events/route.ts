import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const { userId, eventSelections } = await request.json()

    if (!userId || !eventSelections) {
      return NextResponse.json({ error: "User ID and event selections required" }, { status: 400 })
    }

    // Start transaction-like operations
    // First, get current registrations to compare
    const currentRegistrations = await sql`
      SELECT id, eventname, partnerid FROM tbl_partners 
      WHERE userid = ${userId}
    `

    // Track which registrations to keep, update, or delete
    const currentIds = currentRegistrations.map((reg) => reg.id)
    const updatedIds = Object.keys(eventSelections).map((id) => Number.parseInt(id))

    // Delete registrations that are no longer in the selection
    const toDelete = currentIds.filter((id) => !updatedIds.includes(id))
    for (const id of toDelete) {
      // First clear any partner relationships
      const registration = currentRegistrations.find((reg) => reg.id === id)
      if (registration?.partnerid) {
        await sql`
          UPDATE tbl_partners 
          SET partnerid = NULL
          WHERE userid = ${registration.partnerid} AND eventname = ${registration.eventname} AND partnerid = ${userId}
        `
      }

      // Then delete the registration
      await sql`DELETE FROM tbl_partners WHERE id = ${id}`
    }

    // Process each event selection
    for (const [eventIdStr, selection] of Object.entries(eventSelections)) {
      const eventId = Number.parseInt(eventIdStr)
      const { event, partner } = selection as { event: string; partner: string }
      const partnerId = partner === "not-registered" ? null : Number.parseInt(partner)

      // Check if this is a new event (temporary ID > 1000000000000)
      if (eventId > 1000000000000) {
        // This is a new event - insert it
        const insertResult = await sql`
          INSERT INTO tbl_partners (eventname, userid, partnerid, ranking)
          VALUES (${event}, ${userId}, ${partnerId}, NULL)
          RETURNING id
        `

        // If partner selected, update their entry
        if (partnerId) {
          const partnerEntry = await sql`
            SELECT id FROM tbl_partners 
            WHERE userid = ${partnerId} AND eventname = ${event}
          `

          if (partnerEntry.length > 0) {
            await sql`
              UPDATE tbl_partners 
              SET partnerid = ${userId}
              WHERE id = ${partnerEntry[0].id}
            `
          }
        }
      } else {
        // This is an existing event - update it
        const currentReg = currentRegistrations.find((reg) => reg.id === eventId)

        if (currentReg) {
          // Clear old partner relationship if it changed
          if (currentReg.partnerid && currentReg.partnerid !== partnerId) {
            await sql`
              UPDATE tbl_partners 
              SET partnerid = NULL
              WHERE userid = ${currentReg.partnerid} AND eventname = ${currentReg.eventname} AND partnerid = ${userId}
            `
          }

          // Update the registration
          await sql`
            UPDATE tbl_partners 
            SET eventname = ${event}, partnerid = ${partnerId}
            WHERE id = ${eventId}
          `

          // Set new partner relationship
          if (partnerId) {
            const partnerEntry = await sql`
              SELECT id FROM tbl_partners 
              WHERE userid = ${partnerId} AND eventname = ${event}
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
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating events:", error)
    return NextResponse.json({ error: "Failed to update events" }, { status: 500 })
  }
}
