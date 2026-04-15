require("dotenv").config();
const neo4j = require("neo4j-driver");

// 🔗 Create Neo4j Driver
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);

// 🚀 Connect to Database (called from server)
async function connectDB() {
  try {
    await driver.verifyConnectivity();
    console.log("✅ Connected to Neo4j");
  } catch (error) {
    console.error("❌ Failed to connect to Neo4j:", error.message);
    process.exit(1); // stop app if DB fails
  }
}

// 📌 Get a session
function getSession() {
  return driver.session();
}

// 📦 Export functions
module.exports = {
  connectDB,
  getSession
};