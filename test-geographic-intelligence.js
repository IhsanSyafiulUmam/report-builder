/**
 * Geographic Intelligence Section Test
 *
 * This script tests the standardized Geographic Intelligence section
 * to ensure it follows the same pattern as other sections.
 */

import processGeographicIntelligence from "./src/lib/processors/sectionProcessors/geographic_intelligence.js";

// Test data simulating CSV data format
const testData = [
  { Location: "Jakarta", "Total Sales": "Rp 50.2M" },
  { Location: "Surabaya", "Total Sales": "Rp 45.1M" },
  { Location: "Bandung", "Total Sales": "Rp 38.7M" },
  { Location: "Medan", "Total Sales": "Rp 32.4M" },
  { Location: "Semarang", "Total Sales": "Rp 28.9M" },
];

// Test the processor
console.log("🧪 Testing Geographic Intelligence Processor...");
const result = processGeographicIntelligence(testData);

console.log("📊 Processor Result:");
console.log(JSON.stringify(result, null, 2));

// Validate the output structure
const isValid =
  result &&
  Array.isArray(result.chartData) &&
  result.chartData.length > 0 &&
  result.chartData[0].Location &&
  result.chartData[0]["Total Sales"] &&
  Array.isArray(result.insights) &&
  result.insights.length > 0;

console.log(`✅ Processor validation: ${isValid ? "PASSED" : "FAILED"}`);

// Test the component interface structure
const mockSection = {
  id: "geo-1",
  title: "Geographic Intelligence",
  content: {
    text: "Geographic analysis content",
    actionTitle: "Geographic Intelligence",
    subheadline: "Top performing locations by sales revenue",
    chartData: result.chartData,
    insights: result.insights,
    queries: [
      {
        id: "top_locations",
        query:
          'SELECT Lokasi as Location, CONCAT("Rp ", ROUND(SUM(Penjualan) / 1000000, 1), "M") as "Total Sales" FROM sales_data GROUP BY Lokasi ORDER BY SUM(Penjualan) DESC LIMIT 10',
      },
    ],
  },
};

console.log("🏗️ Mock Section Structure:");
console.log(JSON.stringify(mockSection, null, 2));

// Validate section structure matches other standardized sections
const hasRequiredFields =
  mockSection.content.chartData &&
  Array.isArray(mockSection.content.chartData) &&
  mockSection.content.insights &&
  Array.isArray(mockSection.content.insights) &&
  mockSection.content.queries &&
  Array.isArray(mockSection.content.queries);

console.log(
  `✅ Section structure validation: ${hasRequiredFields ? "PASSED" : "FAILED"}`
);

// Test data transformation for chart rendering
const transformedData = mockSection.content.chartData.map((row) => {
  const value = row["Total Sales"]
    ? parseFloat(row["Total Sales"].replace(/[^\d.]/g, "").replace("M", ""))
    : 0;
  return {
    location: row.Location,
    value,
    label: row["Total Sales"] || `${value}M`,
  };
});

console.log("📈 Chart Data Transformation:");
console.log(JSON.stringify(transformedData, null, 2));

const chartDataValid =
  Array.isArray(transformedData) &&
  transformedData.length > 0 &&
  transformedData[0].location &&
  typeof transformedData[0].value === "number" &&
  transformedData[0].label;

console.log(
  `✅ Chart data transformation: ${chartDataValid ? "PASSED" : "FAILED"}`
);

console.log(
  "\n🎉 Geographic Intelligence Section Standardization Test Complete!"
);
console.log(
  `Overall Status: ${
    isValid && hasRequiredFields && chartDataValid
      ? "ALL TESTS PASSED ✅"
      : "SOME TESTS FAILED ❌"
  }`
);
