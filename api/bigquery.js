import express from "express";
import { BigQuery } from "@google-cloud/bigquery";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bigquery = new BigQuery({
  keyFilename: path.join(__dirname, "../service-account.json"),
  projectId: "biqquery-468807",
});

app.post("/api/bigquery", async (req, res) => {
  const { sql, params } = req.body;
  if (!sql) return res.status(400).json({ error: "SQL query required" });
  try {
    const options = {
      query: sql,
      params: params || {},
      location: "US",
    };
    const [job] = await bigquery.createQueryJob(options);
    const [rows] = await job.getQueryResults();
    res.json({ rows });
  } catch (error) {
    console.error("BigQuery error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`BigQuery API listening on port ${PORT}`);
});
