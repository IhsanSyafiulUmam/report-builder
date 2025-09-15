export async function runClickHouseQuery(
  sql: string,
  params?: Record<string, unknown>
) {
  try {
    const response = await fetch(
      "https://be-report.markethac.id/api/clickhouse",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, params }),
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unknown error");
    return data.rows;
  } catch (error) {
    console.error("Error executing ClickHouse query:", error);
    throw new Error(
      `Failed to execute ClickHouse query: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
