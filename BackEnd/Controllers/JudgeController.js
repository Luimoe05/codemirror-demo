const axios = require("axios");
require("dotenv").config();
const JUDGE_API_KEY = process.env.API_KEY;
const JUDGE_API_URL =
  process.env.JUDGE0_API_URL || "https://judge0-ce.p.rapidapi.com";
const JUDGE_API_HOST = process.env.API_HOST;
const LANGUAGE_IDS = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
};
//
exports.run = async (req, res) => {
  try {
    const { source_code, language_name, stdin } = req.body;
    const languageId = LANGUAGE_IDS[language_name.toLowerCase()];
    if (!source_code || !language_name || !languageId) {
      return res.status(400).json({ error: "Missing source code or language" });
    }

    const options = {
      method: "POST",
      url: `${JUDGE_API_URL}/submissions`,
      params: {
        base64_encoded: "false", // send raw code
        wait: "true", // wait for results in this request
        fields: "stdout,stderr,status,message", // get everything back
      },
      headers: {
        "x-rapidapi-key": JUDGE_API_KEY,
        "x-rapidapi-host": JUDGE_API_HOST,
        "Content-Type": "application/json",
      },
      data: {
        source_code,
        language_id: languageId,
        stdin: stdin || "", // optional input
      },
    };

    const response = await axios.request(options);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error running code:", error);
    return res.status(500).json({ error: "Failed to run code" });
  }
};
