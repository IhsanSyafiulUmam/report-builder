import { runQuery as runBigQuery } from "./bigquery/runQuery";
import { runClickHouseQuery } from "./clickhouse/runQuery";

export type DatabaseType = "bigquery" | "clickhouse";

export interface QueryConfig {
  sql: string;
  params?: Record<string, unknown>;
  database: DatabaseType;
}

export async function runUniversalQuery(config: QueryConfig) {
  const { sql, params, database } = config;

  try {
    switch (database) {
      case "bigquery":
        return await runBigQuery(sql, params);
      case "clickhouse":
        return await runClickHouseQuery(sql, params);
      default:
        throw new Error(`Unsupported database type: ${database}`);
    }
  } catch (error) {
    console.error(`Error executing ${database} query:`, error);
    throw error;
  }
}
