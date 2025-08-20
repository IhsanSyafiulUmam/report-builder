export default function processStoreSalesValue(results: any, meta: unknown) {
  const inputData = results?.store_sales_value || [];

  const monthlyData: Record<
    string,
    {
      month: string;
      officialStore: number;
      otherStore: number;
      total: number;
    }
  > = {};

  for (const entry of inputData) {
    const month = entry.Month; 
    const shopType = entry.ShopTypeV2;
    const totalSales = parseFloat(entry.totalsales);

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month: month,
        officialStore: 0,
        otherStore: 0,
        total: 0,
      };
    }

    if (shopType === "official store") {
      monthlyData[month].officialStore += totalSales;
    } else {
      monthlyData[month].otherStore += totalSales;
    }
    monthlyData[month].total += totalSales;
  }

  function formatMonthYear(ymStr: string) {
    const [year, month] = ymStr.split("-");
    const date = new Date(`${year}-${month}-01`);
    return date
      .toLocaleString("en-US", { month: "short", year: "numeric" })
      .replace(" ", "-");
  }

  const chartData = Object.entries(monthlyData)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([_, entry]) => ({
      Month: formatMonthYear(entry.month),
      OfficialStore: +(entry.officialStore / 1e9).toFixed(1),
      OtherStore: +(entry.otherStore / 1e9).toFixed(1),
      Total: +(entry.total / 1e9).toFixed(1),
    }));

  console.log("Processed Store Sales Value Data:", chartData);

  return {
    chartData,
  };
}
