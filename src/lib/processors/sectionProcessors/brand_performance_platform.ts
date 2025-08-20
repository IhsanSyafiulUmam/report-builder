interface Meta {
  brandFilter?: string;
}

export default function processBrandPerformancePlatform(
  results: any,
  meta: Meta
) {
  const data = results.brand_performance_platform;
  const brandFilter = meta?.brandFilter;
  const brandFilters = brandFilter?.split(",").map((b) => b.trim()) || [];
  const monthlyGMVPerPlatform: Record<string, Record<string, number>> = {};
  const monthlyGMVPerPlatformBrand: Record<string, Record<string, number>> = {};

  for (const row of data) {
    const platform = row.Channel;
    const brand = row.Brand;
    const monthKey = row.Month;
    const gmv = parseFloat(row.totalsales);

    if (!monthlyGMVPerPlatform[platform]) monthlyGMVPerPlatform[platform] = {};
    if (!monthlyGMVPerPlatform[platform][monthKey])
      monthlyGMVPerPlatform[platform][monthKey] = 0;
    monthlyGMVPerPlatform[platform][monthKey] += gmv;

    if (brandFilters.includes(brand)) {
      if (!monthlyGMVPerPlatformBrand[platform])
        monthlyGMVPerPlatformBrand[platform] = {};
      if (!monthlyGMVPerPlatformBrand[platform][monthKey])
        monthlyGMVPerPlatformBrand[platform][monthKey] = 0;
      monthlyGMVPerPlatformBrand[platform][monthKey] += gmv;
    }
  }

  const allMonths = Object.values(monthlyGMVPerPlatform)
    .flatMap((obj) => Object.keys(obj))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  const latestMonth = allMonths[allMonths.length - 1];
  const prevMonth = allMonths[allMonths.length - 2];

  const formatBio = (val: number) => `${(val / 1e9).toFixed(1)} Bio`;
  const formatPct = (val: number) => `${val.toFixed(2)}%`;

  const output = [];

  for (const platform of Object.keys(monthlyGMVPerPlatform)) {
    const marketTimeline = monthlyGMVPerPlatform[platform];
    const brandTimeline = monthlyGMVPerPlatformBrand[platform] || {};

    const currentMarketGMV = marketTimeline[latestMonth] || 0;
    const prevMarketGMV = marketTimeline[prevMonth] || 0;

    const currentGMV = brandTimeline[latestMonth] || 0;
    const prevGMV = brandTimeline[prevMonth] || 0;

    const brandShare =
      currentMarketGMV > 0 ? (currentGMV / currentMarketGMV) * 100 : 0;
    const brandGrowth =
      prevGMV > 0 ? ((currentGMV - prevGMV) / prevGMV) * 100 : 0;
    const marketGrowth =
      prevMarketGMV > 0
        ? ((currentMarketGMV - prevMarketGMV) / prevMarketGMV) * 100
        : 0;

    let signal = "❌ Missing Out";

    if (marketGrowth < 0) {
      if (brandGrowth > 0) {
        signal = "✅ Resilient Performer";
      } else if (brandGrowth < 0 && brandGrowth >= marketGrowth) {
        signal = "⚠️ Lagging";
      } else if (brandGrowth < 0 && brandGrowth < marketGrowth) {
        signal = "🔻 Losing Ground";
      }
    } else {
      if (brandGrowth > 0 && brandGrowth >= marketGrowth) {
        signal = "✅ Winning";
      } else if (brandGrowth > 0 && brandGrowth < marketGrowth) {
        signal = "⚠️ Lagging";
      } else if (brandGrowth < 0) {
        signal = "❌ Missing Out";
      }
    }

    output.push({
      Platform: platform,
      "Brand GMV (Bio)": formatBio(currentGMV),
      "Brand Share (%)": formatPct(brandShare),
      "QoQ Growth": formatPct(brandGrowth),
      "Market Growth": formatPct(marketGrowth),
      "Performance Signal": signal,
    });
  }

  console.log("Brand Performance Platform Data:", output);

  return {
    chartData: output,
  };
}
