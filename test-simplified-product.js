// Test the simplified product insights processor

// Simulate queryResults structure that processSection would pass
const queryResults = {
  top_products: [
    { product_name: "Laptop Lenovo", total_revenue: "45000000" },
    { product_name: "Monitor Samsung", total_revenue: "32000000" },
    { product_name: "Keyboard Mechanical", total_revenue: "28000000" },
    { product_name: "Mouse Logitech", total_revenue: "22000000" },
    { product_name: "Printer Epson", total_revenue: "18000000" },
  ],
};

// Simplified processor function
function processProductInsights(queryResults) {
  const productData = Array.isArray(queryResults.top_products)
    ? queryResults.top_products
    : [];

  const chartData = productData.map((product) => ({
    Product: product.product_name || "Unknown Product",
    "Total Revenue": product.total_revenue
      ? `Rp ${(parseFloat(product.total_revenue.toString()) / 1000000).toFixed(
          1
        )}M`
      : "Rp 0M",
  }));

  console.log("Processed product insights data:", {
    chartData: chartData.length,
    totalProducts: productData.length,
  });

  return {
    chartData,
  };
}

console.log("=== Testing Simplified Product Insights ===");
console.log("Input queryResults:");
console.log(JSON.stringify(queryResults, null, 2));

console.log("\nOutput:");
const result = processProductInsights(queryResults);
console.log(JSON.stringify(result, null, 2));

console.log("\n=== Compare with other sections ===");
console.log("Sales format: { Month, 'SUM of GMV' }");
console.log("Customer format: { Customer, 'Total Sales' }");
console.log("Product format: { Product, 'Total Revenue' }");
