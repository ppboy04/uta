import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ensureTables } from "@/lib/db-init"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    await ensureTables()
    const { playerData, eventData } = await request.json()

    // Check if player already exists
    const existingPlayer = await sql`
      SELECT id FROM tbl_players 
      WHERE whatsappnumber = ${playerData.whatsappNumber}
    `

    let playerId: number

    if (existingPlayer.length > 0) {
      // Update existing player
      playerId = existingPlayer[0].id
      await sql`
        UPDATE tbl_players SET
          name = ${playerData.name},
          dateofbirth = ${playerData.dateOfBirth},
          city = ${playerData.city},
          shirtsize = ${playerData.shirtSize},
          shortsize = ${playerData.shortSize},
          foodpref = ${playerData.foodPref},
          stayyorn = ${playerData.stayYorN},
          feepaid = ${playerData.feePaid}
        WHERE id = ${playerId}
      `
    } else {
      // Insert new player
      const playerResult = await sql`
        INSERT INTO tbl_players (
          name, whatsappnumber, dateofbirth, city, shirtsize, shortsize, 
          foodpref, stayyorn, feepaid
        ) VALUES (
          ${playerData.name}, ${playerData.whatsappNumber}, ${playerData.dateOfBirth},
          ${playerData.city}, ${playerData.shirtSize}, ${playerData.shortSize},
          ${playerData.foodPref}, ${playerData.stayYorN}, ${playerData.feePaid}
        ) RETURNING id
      `
      playerId = playerResult[0].id
    }

    // Handle Event 1
    if (eventData.event1) {
      // Check if user already registered for this event
      const existingEntry = await sql`
        SELECT id FROM tbl_partners 
        WHERE eventname = ${eventData.event1} AND userid = ${playerId}
      `

      if (existingEntry.length === 0) {
        // Handle partner selection
        let partnerId = null
        if (eventData.partner1 && eventData.partner1 !== "not-registered") {
          // Check if partner exists and is available (not already paired)
          const partnerEntry = await sql`
            SELECT id FROM tbl_partners 
            WHERE eventname = ${eventData.event1} 
            AND userid = ${Number.parseInt(eventData.partner1)} 
            AND partnerid IS NULL
          `

          if (partnerEntry.length > 0) {
            partnerId = Number.parseInt(eventData.partner1)
            // Update partner's entry
            await sql`
              UPDATE tbl_partners 
              SET partnerid = ${playerId}
              WHERE id = ${partnerEntry[0].id}
            `
          }
        }

        // Insert new entry
        await sql`
          INSERT INTO tbl_partners (eventname, userid, partnerid, ranking)
          VALUES (${eventData.event1}, ${playerId}, ${partnerId}, NULL)
        `
      }
    }

    // Handle Event 2
    if (eventData.event2) {
      const existingEntry = await sql`
        SELECT id FROM tbl_partners 
        WHERE eventname = ${eventData.event2} AND userid = ${playerId}
      `

      if (existingEntry.length === 0) {
        let partnerId = null
        if (eventData.partner2 && eventData.partner2 !== "not-registered") {
          // Check if partner exists and is available (not already paired)
          const partnerEntry = await sql`
            SELECT id FROM tbl_partners 
            WHERE eventname = ${eventData.event2} 
            AND userid = ${Number.parseInt(eventData.partner2)} 
            AND partnerid IS NULL
          `

          if (partnerEntry.length > 0) {
            partnerId = Number.parseInt(eventData.partner2)
            await sql`
              UPDATE tbl_partners 
              SET partnerid = ${playerId}
              WHERE id = ${partnerEntry[0].id}
            `
          }
        }

        await sql`
          INSERT INTO tbl_partners (eventname, userid, partnerid, ranking)
          VALUES (${eventData.event2}, ${playerId}, ${partnerId}, NULL)
        `
      }
    }

    return NextResponse.json({ success: true, playerId })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
