// Test file untuk mengecek struktur data CustomerPerformanceSection

// Fungsi processor yang disalin dari customer_performance.ts
function processCustomerPerformance(results) {
  const customerAnalysisData = Array.isArray(results)
    ? results
    : Array.isArray(results?.customer_analysis)
    ? results.customer_analysis
    : [];

  // Process top customers data and format it like sales overview
  const chartData = customerAnalysisData.slice(0, 10).map((customer) => ({
    Customer: customer.customer_name || "Unknown Customer",
    "Total Sales": customer.total_sales
      ? `Rp ${(parseFloat(customer.total_sales.toString()) / 1000000).toFixed(
          1
        )}M`
      : "Rp 0M",
  }));

  console.log("Processed customer performance data:", {
    chartData: chartData.length,
    totalCustomers: customerAnalysisData.length,
  });

  return {
    chartData,
  };
}

// Sample data yang mirip dengan struktur CSV
const sampleData = [
  {
    customer_name: "PT Sinar Jaya",
    total_sales: "50000000", // 50M
    customer_category: "Distributor",
    location: "Jakarta",
    order_count: "25",
    avg_order_value: "2000000",
  },
  {
    customer_name: "UD Sentosa",
    total_sales: "35000000", // 35M
    customer_category: "Distributor",
    location: "Surabaya",
    order_count: "18",
    avg_order_value: "1944444",
  },
  {
    customer_name: "CV Berkah Abadi",
    total_sales: "28000000", // 28M
    customer_category: "Grosir",
    location: "Semarang",
    order_count: "12",
    avg_order_value: "2333333",
  },
  {
    customer_name: "PT Makmur Bersama",
    total_sales: "22000000", // 22M
    customer_category: "Retail",
    location: "Medan",
    order_count: "15",
    avg_order_value: "1466667",
  },
];

console.log("Sample input data:");
console.log(JSON.stringify(sampleData, null, 2));

console.log("\nProcessed output:");
const result = processCustomerPerformance(sampleData);
console.log(JSON.stringify(result, null, 2));

console.log("\nExpected format for SalesOverviewSection comparison:");
const salesOverviewFormat = [
  { Month: "Jan 2024", "SUM of GMV": "15.2 Bio" },
  { Month: "Feb 2024", "SUM of GMV": "18.7 Bio" },
  { Month: "Mar 2024", "SUM of GMV": "22.1 Bio" },
];
console.log(JSON.stringify(salesOverviewFormat, null, 2));
