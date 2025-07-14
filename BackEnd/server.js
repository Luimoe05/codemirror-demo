// importing needed things
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const JudgeRoutes = require("./Routes/JudgeRoute");
const app = express();
const corsOption = {
  origin: "http://localhost:5173",
};

// Middleware, using what is needed
app.use(express.json());
app.use(cors(corsOption));
app.use("/api", JudgeRoutes);

const JUDGE_API_KEY = process.env.API_KEY;
const JUDGE_API_URL =
  process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE_API_HOST = process.env.API_HOST;

// route for the root path,. the default "/"
app.get("/", (req, res) => {
  res.send("Loading Judge0 API...");
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
