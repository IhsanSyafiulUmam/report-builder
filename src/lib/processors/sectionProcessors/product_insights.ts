interface ProductData {
  product_name?: string;
  total_revenue?: string | number;
}

interface QueryResults {
  top_products?: ProductData[];
  [key: string]: unknown;
}

export default function processProductInsights(queryResults: QueryResults) {
  // Get data from the single "top_products" query
  const productData = Array.isArray(queryResults.top_products)
    ? queryResults.top_products
    : [];

  // Process top products data and format it like sales overview
  const chartData = productData.map((product: ProductData) => ({
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
