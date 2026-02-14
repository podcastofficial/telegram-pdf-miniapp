import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PlayQube Backend Running 🚀");
});

// AUTH
app.post("/auth", async (req, res) => {
  const { telegram_id, username, first_name } = req.body;

  let user = await pool.query(
    "SELECT * FROM users WHERE telegram_id=$1",
    [telegram_id]
  );

  if (user.rows.length === 0) {
    await pool.query(
      "INSERT INTO users (telegram_id, username, first_name, coins) VALUES ($1,$2,$3,0)",
      [telegram_id, username, first_name]
    );
  }

  const updatedUser = await pool.query(
    "SELECT coins FROM users WHERE telegram_id=$1",
    [telegram_id]
  );

  res.json({ success: true, coins: updatedUser.rows[0].coins });
});

// EARN
app.post("/earn", async (req, res) => {
  const { telegram_id, amount } = req.body;

  await pool.query(
    "UPDATE users SET coins = coins + $1 WHERE telegram_id=$2",
    [amount, telegram_id]
  );

  const user = await pool.query(
    "SELECT coins FROM users WHERE telegram_id=$1",
    [telegram_id]
  );

  res.json({ success: true, coins: user.rows[0].coins });
});

// LEADERBOARD
app.get("/leaderboard", async (req, res) => {
  const result = await pool.query(
    "SELECT username, coins FROM users ORDER BY coins DESC LIMIT 10"
  );

  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
