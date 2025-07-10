import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    console.log("🚀 Starting database setup...")

    // Step 1: Create Events Table
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_eventname (
          id SERIAL PRIMARY KEY,
          eventname VARCHAR(10) NOT NULL UNIQUE,
          description TEXT
      )
    `

    // Step 2: Insert Events
    await sql`
      INSERT INTO tbl_eventname (eventname, description) VALUES 
      ('A', 'Category A (Open)'),
      ('B', 'Category B (90+ combined)'),
      ('C', 'Category C (105+ combined)'),
      ('D', 'Category D (120+ combined)')
      ON CONFLICT (eventname) DO NOTHING
    `

    // Step 3: Create Players Table
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_players (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          whatsappnumber VARCHAR(20) NOT NULL,
          dateofbirth DATE NOT NULL,
          city VARCHAR(100) NOT NULL,
          shirtsize VARCHAR(10) NOT NULL,
          shortsize VARCHAR(10) NOT NULL,
          foodpref VARCHAR(50) NOT NULL,
          stayyorn BOOLEAN DEFAULT FALSE,
          feepaid BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Add feeapproved column if it doesn't exist (for existing databases)
    await sql`
      ALTER TABLE tbl_players 
      ADD COLUMN IF NOT EXISTS feeapproved BOOLEAN DEFAULT FALSE
    `

    // Step 4: Create Partners Table
    await sql`
      CREATE TABLE IF NOT EXISTS tbl_partners (
          id SERIAL PRIMARY KEY,
          eventname VARCHAR(10) NOT NULL,
          userid INTEGER NOT NULL,
          partnerid INTEGER,
          ranking INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (eventname) REFERENCES tbl_eventname(eventname),
          FOREIGN KEY (userid) REFERENCES tbl_players(id),
          FOREIGN KEY (partnerid) REFERENCES tbl_players(id)
      )
    `

    // Step 5: Create Indexes
    await sql`
      CREATE INDEX IF NOT EXISTS idx_players_whatsapp_dob ON tbl_players(whatsappnumber, dateofbirth)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_partners_event ON tbl_partners(eventname)
    `
    await sql`
      CREATE INDEX IF NOT EXISTS idx_partners_user ON tbl_partners(userid)
    `

    // Step 6: Insert Sample Players
    const samplePlayers = [
      ["Rajesh Kumar", "9876543210", "1990-05-15", "Delhi", "L", "L", "Vegetarian", true, true, true],
      ["Amit Sharma", "9876543211", "1988-08-22", "Mumbai", "M", "M", "Non-Vegetarian", false, true, false],
      ["Priya Singh", "9876543212", "1992-03-10", "Bangalore", "S", "S", "Vegetarian", true, true, true],
      ["Vikram Gupta", "9876543213", "1985-12-05", "Chennai", "XL", "L", "Non-Vegetarian", false, true, false],
      ["Neha Agarwal", "9876543214", "1991-07-18", "Pune", "M", "S", "Vegetarian", true, false, false],
      ["Rohit Verma", "9876543215", "1987-11-30", "Hyderabad", "L", "M", "Non-Vegetarian", false, true, true],
      ["Kavya Reddy", "9876543216", "1993-01-25", "Kolkata", "S", "XS", "Vegan", true, true, false],
      ["Arjun Patel", "9876543217", "1989-09-12", "Ahmedabad", "M", "M", "Vegetarian", false, true, true],
      ["Sneha Joshi", "9876543218", "1994-04-08", "Jaipur", "S", "S", "Non-Vegetarian", true, false, false],
      ["Karan Malhotra", "9876543219", "1986-06-20", "Lucknow", "XL", "L", "Vegetarian", false, true, false],
      ["Pooja Mehta", "9876543220", "1990-10-14", "Surat", "M", "M", "Non-Vegetarian", true, true, true],
      ["Deepak Yadav", "9876543221", "1988-02-28", "Kanpur", "L", "L", "Vegetarian", false, false, false],
    ]

    for (const player of samplePlayers) {
      await sql`
        INSERT INTO tbl_players (name, whatsappnumber, dateofbirth, city, shirtsize, shortsize, foodpref, stayyorn, feepaid, feeapproved)
        VALUES (${player[0]}, ${player[1]}, ${player[2]}, ${player[3]}, ${player[4]}, ${player[5]}, ${player[6]}, ${player[7]}, ${player[8]}, ${player[9]})
        ON CONFLICT DO NOTHING
      `
    }

    // Step 7: Insert Sample Partner Entries
    const partnerEntries = [
      // Category A pairs with rankings
      ["A", 1, 2, 1],
      ["A", 2, 1, 1], // Winners
      ["A", 3, 4, 2],
      ["A", 4, 3, 2], // Runners-up
      ["A", 5, 6, 3],
      ["A", 6, 5, 3], // Semi-finalists
      ["A", 7, 8, 3],
      ["A", 8, 7, 3], // Semi-finalists

      // Category B pairs
      ["B", 9, 10, 1],
      ["B", 10, 9, 1], // Winners
      ["B", 11, 12, 2],
      ["B", 12, 11, 2], // Runners-up

      // Category C pairs (some without partners)
      ["C", 1, 3, null],
      ["C", 3, 1, null],
      ["C", 5, null, null], // Looking for partner
      ["C", 7, null, null], // Looking for partner

      // Category D pairs
      ["D", 2, 4, null],
      ["D", 4, 2, null],
      ["D", 6, null, null], // Looking for partner
      ["D", 8, null, null], // Looking for partner
    ]

    for (const entry of partnerEntries) {
      await sql`
        INSERT INTO tbl_partners (eventname, userid, partnerid, ranking)
        VALUES (${entry[0]}, ${entry[1]}, ${entry[2]}, ${entry[3]})
        ON CONFLICT DO NOTHING
      `
    }

    // Step 8: Verify Setup
    const eventCount = await sql`SELECT COUNT(*) as count FROM tbl_eventname`
    const playerCount = await sql`SELECT COUNT(*) as count FROM tbl_players`
    const partnerCount = await sql`SELECT COUNT(*) as count FROM tbl_partners`

    console.log("✅ Database setup completed successfully!")

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully!",
      stats: {
        events: eventCount[0].count,
        players: playerCount[0].count,
        partnerships: partnerCount[0].count,
      },
      testCredentials: {
        userLogin: [
          { whatsapp: "9876543210", dob: "1990-05-15", name: "Rajesh Kumar" },
          { whatsapp: "9876543211", dob: "1988-08-22", name: "Amit Sharma" },
          { whatsapp: "9876543212", dob: "1992-03-10", name: "Priya Singh" },
        ],
        adminLogin: { username: "admin", password: "uta2024" },
      },
    })
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Check database status
    const eventCount = await sql`SELECT COUNT(*) as count FROM tbl_eventname`
    const playerCount = await sql`SELECT COUNT(*) as count FROM tbl_players`
    const partnerCount = await sql`SELECT COUNT(*) as count FROM tbl_partners`

    return NextResponse.json({
      status: "connected",
      stats: {
        events: eventCount[0].count,
        players: playerCount[0].count,
        partnerships: partnerCount[0].count,
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: "not_setup",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
