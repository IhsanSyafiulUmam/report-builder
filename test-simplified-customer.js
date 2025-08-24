// Test the simplified customer performance processor

// Simulate queryResults structure that processSection would pass
const queryResults = {
  top_customers: [
    { customer_name: "PT Sinar Jaya", total_sales: "50000000" },
    { customer_name: "UD Sentosa", total_sales: "35000000" },
    { customer_name: "CV Berkah Abadi", total_sales: "28000000" },
    { customer_name: "PT Makmur Bersama", total_sales: "22000000" },
  ],
};

// Simplified processor function
function processCustomerPerformance(queryResults) {
  const customerData = Array.isArray(queryResults.top_customers)
    ? queryResults.top_customers
    : [];

  const chartData = customerData.map((customer) => ({
    Customer: customer.customer_name || "Unknown Customer",
    "Total Sales": customer.total_sales
      ? `Rp ${(parseFloat(customer.total_sales.toString()) / 1000000).toFixed(
          1
        )}M`
      : "Rp 0M",
  }));

  console.log("Processed customer performance data:", {
    chartData: chartData.length,
    totalCustomers: customerData.length,
  });

  return {
    chartData,
  };
}

console.log("=== Testing Simplified Customer Performance ===");
console.log("Input queryResults:");
console.log(JSON.stringify(queryResults, null, 2));

console.log("\nOutput:");
const result = processCustomerPerformance(queryResults);
console.log(JSON.stringify(result, null, 2));

console.log("\n=== Compare with SalesOverview format ===");
const salesFormat = {
  chartData: [
    { Month: "Jan 2024", "SUM of GMV": "15.2 Bio" },
    { Month: "Feb 2024", "SUM of GMV": "18.7 Bio" },
  ],
};
console.log("Sales format:");
console.log(JSON.stringify(salesFormat, null, 2));
