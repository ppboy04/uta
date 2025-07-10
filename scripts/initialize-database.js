// This script will call the setup API to initialize the database
async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database...")

    const response = await fetch("/api/setup-database", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (result.success) {
      console.log("✅ Database initialized successfully!")
      console.log("📊 Statistics:")
      console.log(`   - Events: ${result.stats.events}`)
      console.log(`   - Players: ${result.stats.players}`)
      console.log(`   - Partnerships: ${result.stats.partnerships}`)

      console.log("\n🧪 Test Credentials:")
      console.log("👤 User Login (WhatsApp + DOB):")
      result.testCredentials.userLogin.forEach((user) => {
        console.log(`   - ${user.name}: ${user.whatsapp} + ${user.dob}`)
      })

      console.log("🔐 Admin Login:")
      console.log(`   - Username: ${result.testCredentials.adminLogin.username}`)
      console.log(`   - Password: ${result.testCredentials.adminLogin.password}`)

      console.log("\n🎯 Ready to test:")
      console.log("   1. Visit /register to add new players")
      console.log("   2. Visit /user-login with test credentials")
      console.log("   3. Visit /admin-dashboard with admin credentials")
    } else {
      console.error("❌ Database initialization failed:", result.error)
      if (result.details) {
        console.error("Details:", result.details)
      }
    }

    return result
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    return { success: false, error: error.message }
  }
}

// Run the initialization
initializeDatabase()
