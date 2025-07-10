/**
 * lib/db-init.ts
 * Ensures the required tables exist (runs once per cold-start).
 */
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)
let initialised = false

export async function ensureTables() {
  if (initialised) return

  // 1 statement per call – driver forbids multiple cmds per statement
  await sql`
    CREATE TABLE IF NOT EXISTS tbl_eventname (
      id SERIAL PRIMARY KEY,
      eventname VARCHAR(10) UNIQUE NOT NULL,
      description TEXT
    )
  `
  await sql`
    INSERT INTO tbl_eventname (eventname, description) VALUES
      ('A','Category A (Open)'),
      ('B','Category B (90+ combined)'),
      ('C','Category C (105+ combined)'),
      ('D','Category D (120+ combined)')
    ON CONFLICT (eventname) DO NOTHING
  `
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
      feepaid  BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `

  // Add feeapproved column if it does not exist (needed for payment workflow)
  await sql`
    ALTER TABLE tbl_players
    ADD COLUMN IF NOT EXISTS feeapproved BOOLEAN DEFAULT FALSE
  `

  await sql`
    CREATE TABLE IF NOT EXISTS tbl_partners (
      id        SERIAL PRIMARY KEY,
      eventname VARCHAR(10) NOT NULL REFERENCES tbl_eventname(eventname),
      userid    INTEGER     NOT NULL REFERENCES tbl_players(id),
      partnerid INTEGER REFERENCES tbl_players(id),
      ranking   INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_players_lookup
      ON tbl_players(whatsappnumber, dateofbirth)
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_partners_event ON tbl_partners(eventname)
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_partners_user  ON tbl_partners(userid)
  `

  initialised = true
}
