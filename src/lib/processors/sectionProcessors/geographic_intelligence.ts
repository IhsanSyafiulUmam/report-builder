export default function processGeographicIntelligence(results: unknown) {
  // Handle data from CSV processor format
  const resultsObj = results as { top_locations?: unknown[] };
  const rawData = Array.isArray(results)
    ? results
    : Array.isArray(resultsObj?.top_locations)
    ? resultsObj.top_locations
    : [];

  console.log("Processing geographic intelligence data:", rawData);

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
