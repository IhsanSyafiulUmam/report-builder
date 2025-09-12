interface CustomerData {
  customer_name?: string;
  total_sales?: string | number;
}

interface QueryResults {
  top_customers?: CustomerData[];
  top_customers_ch?: CustomerData[]; // Add ClickHouse data
  [key: string]: unknown;
}

export default function processCustomerPerformance(queryResults: QueryResults) {
  // Try to get data from BigQuery first, then ClickHouse, then fallback to empty array
  const customerData = Array.isArray(queryResults.top_customers)
    ? queryResults.top_customers
    : Array.isArray(queryResults.top_customers_ch)
    ? queryResults.top_customers_ch
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
    dataSource: queryResults.top_customers ? "BigQuery" : "ClickHouse",
  });

  return {
    chartData,
  };
}
