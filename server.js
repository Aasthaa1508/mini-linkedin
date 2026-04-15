require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { getSession } = require("./db");

const app = express();

/* ===============================
   🔹 MIDDLEWARE
================================ */
app.use(cors());
app.use(express.json());

/* ===============================
   🔹 SERVE FRONTEND
================================ */
const frontendPath = path.join(__dirname, "frontend");
app.use(express.static(frontendPath));

/* ===============================
   🔹 ROOT ROUTE
================================ */
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===============================
   🔹 TEST API
================================ */
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend working 🚀" });
});

/* ===============================
   🔹 ADD USER
================================ */
app.post("/add-user", async (req, res) => {
    const session = getSession();
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name required" });
    }

    try {
        await session.run(
            "MERGE (u:User {name:$name})",
            { name }
        );

        res.json({ message: `User ${name} added` });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    } 
    finally {
        await session.close();
    }
});

/* ===============================
   🔹 ADD FRIEND
================================ */
app.post("/add-friend", async (req, res) => {
    const session = getSession();
    const { user1, user2 } = req.body;

    if (!user1 || !user2) {
        return res.status(400).json({ error: "Both users required" });
    }

    try {
        await session.run(
            `
            MATCH (a:User {name:$user1}), (b:User {name:$user2})
            MERGE (a)-[:FOLLOWS]-(b)
            `,
            { user1, user2 }
        );

        res.json({ message: "Friend added" });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    } 
    finally {
        await session.close();
    }
});

/* ===============================
   🔹 MUTUAL FRIENDS
================================ */
app.get("/mutual/:u1/:u2", async (req, res) => {
    const session = getSession();

    try {
        const result = await session.run(
            `
            MATCH (a:User {name:$u1})-[:FOLLOWS]-(m)-[:FOLLOWS]-(b:User {name:$u2})
            RETURN m.name AS mutual
            `,
            { u1: req.params.u1, u2: req.params.u2 }
        );

        const data = result.records.map(r => r.get("mutual"));

        res.json({ mutuals: data });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    } 
    finally {
        await session.close();
    }
});

/* ===============================
   🔥 RECOMMENDATIONS
================================ */
app.get("/recommend/:user", async (req, res) => {
    const session = getSession();

    try {
        const result = await session.run(
            `
            MATCH (u:User {name:$user})-[:FOLLOWS]-(f)-[:FOLLOWS]-(rec)
            WHERE NOT (u)-[:FOLLOWS]-(rec) AND u <> rec
            RETURN DISTINCT rec.name AS recommendation
            `,
            { user: req.params.user }
        );

        const data = result.records.map(r => r.get("recommendation"));

        res.json({ recommendations: data });
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    } 
    finally {
        await session.close();
    }
});

/* ===============================
   🔥 FALLBACK ROUTE
================================ */
app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===============================
   🚀 START SERVER
================================ */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});