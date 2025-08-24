interface CustomerData {
  customer_name?: string;
  total_sales?: string | number;
}

interface QueryResults {
  top_customers?: CustomerData[];
  [key: string]: unknown;
}

export default function processCustomerPerformance(queryResults: QueryResults) {
  // Get data from the single "top_customers" query
  const customerData = Array.isArray(queryResults.top_customers)
    ? queryResults.top_customers
    : [];

  // Process top customers data and format it like sales overview
  const chartData = customerData.map((customer: CustomerData) => ({
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
