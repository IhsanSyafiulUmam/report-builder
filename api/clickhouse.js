import express from "express";
import { createClient } from "@clickhouse/client";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());



const clickhouse = createClient({
  url: process.env.CLICKHOUSE_HOST || "http://194.233.69.159:8123",
  username: process.env.CLICKHOUSE_USERNAME || "mysql_user",
  password: process.env.CLICKHOUSE_PASSWORD || "bwbVGhdC6O7ndY9A",
  database: process.env.CLICKHOUSE_DATABASE || "CosmicArchive",
});

app.post("/api/clickhouse", async (req, res) => {
  const { sql, params } = req.body;
  if (!sql) return res.status(400).json({ error: "SQL query required" });

  try {
    // Replace parameters in the query if any
    let processedQuery = sql;
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        processedQuery = processedQuery.replace(
          new RegExp(`{${key}}`, "g"),
          typeof value === "string" ? `'${value}'` : String(value)
        );
      });
    }

    const result = await clickhouse.query({
      query: processedQuery,
      format: "JSONEachRow",
    });

    const rows = await result.json();
    res.json({ rows });
  } catch (error) {
    console.error("ClickHouse error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.CLICKHOUSE_PORT || 4000;
app.listen(PORT, () => {
  console.log(`ClickHouse API listening on port ${PORT}`);
});
