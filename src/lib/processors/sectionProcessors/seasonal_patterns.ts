interface MonthlyTopProductData {
  month?: string;
  month_sort?: string;
  product_name?: string;
  order_count?: string | number;
}

interface QueryResults {
  monthly_top_products?: MonthlyTopProductData[];
  monthly_product_sales?: MonthlyTopProductData[]; // Keep for backward compatibility
  monthly_sales?: MonthlyTopProductData[]; // Keep for backward compatibility
  [key: string]: unknown;
}

export default function processSeasonalPatterns(queryResults: QueryResults) {
  // Get data from monthly_top_products query first, fallback to other sources for compatibility
  const monthlyData = Array.isArray(queryResults.monthly_top_products)
    ? queryResults.monthly_top_products
    : Array.isArray(queryResults.monthly_product_sales)
    ? queryResults.monthly_product_sales
    : Array.isArray(queryResults.monthly_sales)
    ? queryResults.monthly_sales
    : [];

  // Group data by month and create structure similar to platform sales
  const monthsMap = new Map<string, Record<string, string | number>>();

  monthlyData.forEach((item: MonthlyTopProductData) => {
    const month = item.month || "Unknown Month";
    const productName = item.product_name || "Unknown Product";
    const orderCount = item.order_count || 0;

    // Convert order count to number
    let orderCountNum = 0;
    if (typeof orderCount === "string") {
      orderCountNum = parseFloat(orderCount);
    } else {
      orderCountNum = Number(orderCount);
    }

    if (!monthsMap.has(month)) {
      monthsMap.set(month, {
        Month: month,
        month_sort: item.month_sort || "",
      });
    }

    // Add product order count to month data
    const monthData = monthsMap.get(month);
    if (monthData) {
      monthData[productName] = orderCountNum;
    }
  });

  // Convert map to array and sort by month_sort
  const chartData = Array.from(monthsMap.values()).sort((a, b) => {
    const aSort = typeof a.month_sort === "string" ? a.month_sort : "";
    const bSort = typeof b.month_sort === "string" ? b.month_sort : "";
    return aSort.localeCompare(bSort);
  });

  console.log("Processed seasonal patterns (product order counts) data:", {
    chartData: chartData.length,
    totalMonths: chartData.length,
    totalProducts: monthlyData.length,
    products: [...new Set(monthlyData.map((item) => item.product_name))],
    dataSource: queryResults.monthly_top_products
      ? "monthly_top_products"
      : queryResults.monthly_product_sales
      ? "monthly_product_sales"
      : "monthly_sales",
  });

  return {
    chartData,
  };
}
