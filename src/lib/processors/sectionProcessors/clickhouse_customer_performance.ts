// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function processClickhouseCustomerPerformance(results: Record<string, unknown>, _meta: unknown) {
  const inputData = Array.isArray(results)
    ? results
    : Array.isArray(results?.top_customers_ch)
    ? results.top_customers_ch
    : [];

  console.log("Processing ClickHouse customer performance data:", inputData);

  const chartData = inputData.map((row: Record<string, unknown>) => ({
    Customer: row.customer_name || "Unknown",
    "Total Sales": `Rp ${((row.total_sales as number) / 1000000).toFixed(1)}M`,
  }));

  return {
    chartData,
  };
}
