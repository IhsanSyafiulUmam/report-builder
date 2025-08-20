
export async function runQuery(sql: string, params?: Record<string, unknown>) {
  try {
    const response = await fetch("http://localhost:4000/api/bigquery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unknown error");
    return data.rows;
  } catch (error) {
    console.error("Error executing BigQuery query:", error);
    throw new Error(
      `Failed to execute query: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
