export default function processTopBrandChannel(results: any, meta: unknown) {
  const items = results.top_brand_channel || [];

  const formatGMV = (value: any) => {
    const num = parseFloat(value);
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + " Bio";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + " Mio";
    } else {
      return num.toFixed(2);
    }
  };

  const formatGrowth = (value: any) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "0.00%";

    const formatted = num.toFixed(2);
    return num > 0 ? `+${formatted}%` : `${formatted}%`;
  };

  const chartData = items.map((item: any) => {
    const data = item.json || item;
    return {
      Channel: data.Channel || data.channel || "",
      Brand: data.Brand || data.brand || data.BrandName || "",
      "GMV (Bio)": formatGMV(
        data.GMV || data.totalsales || data.gmv || data.TotalSales || 0
      ),
      "Monthly Growth (%)": formatGrowth(
        data.MonthlyGrowthPct || data.monthly_growth_pct || data.MonthlyGrowth || data.growth || 0
      ),
    };
  });

  console.log("Top Brand Channel Data:", chartData);

  return {
    chartData,
  };
}
