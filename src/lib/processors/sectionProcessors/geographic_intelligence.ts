export default function processGeographicIntelligence(results: unknown) {
  // Handle data from both BigQuery and ClickHouse
  const resultsObj = results as {
    top_locations?: unknown[];
    top_locations_ch?: unknown[]; // Add ClickHouse support
  };

  // Try BigQuery data first, then ClickHouse, then fallback
  const rawData = Array.isArray(results)
    ? results
    : Array.isArray(resultsObj?.top_locations)
    ? resultsObj.top_locations
    : Array.isArray(resultsObj?.top_locations_ch)
    ? resultsObj.top_locations_ch
    : [];

  console.log("Processing geographic intelligence data:", {
    rawDataLength: rawData.length,
    dataSource: resultsObj?.top_locations ? "BigQuery" : "ClickHouse",
  });

  // Transform data to chartData format expected by component
  const chartData = rawData.map(
    (row: {
      Location?: string;
      location?: string;
      Total_Sales?: string;
      "Total Sales"?: string;
      total_sales?: string;
    }) => ({
      Location: row.Location || row.location || "Unknown",
      "Total Sales":
        row.Total_Sales || row["Total Sales"] || row.total_sales || "Rp 0M",
    })
  );

  return {
    chartData: chartData,
    insights: [
      {
        title: "Geographic Performance",
        body: `Analysis shows performance across ${chartData.length} locations with varying sales distribution.`,
      },
    ],
  };
}
