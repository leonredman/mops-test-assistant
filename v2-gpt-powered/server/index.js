import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fixturesRouter from "./routes/fixtures.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", fixturesRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Express server running!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
