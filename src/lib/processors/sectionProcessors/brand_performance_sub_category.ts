export default function processBrandPerformanceSubCategory(
  results: any,
  meta: unknown
) {
  const data = results.brand_performance_sub_category;
  const brandFilter = "Erha";

  const monthlyGMVPerCategory: Record<string, Record<string, number>> = {};
  const monthlyGMVPerCategoryBrand: Record<string, Record<string, number>> = {};

  for (const row of data) {
    const subcategory = row.SubCategory;
    const brand = row.Brand;
    const monthKey = row.Month;
    const gmv = parseFloat(row.totalsales);

    if (!monthlyGMVPerCategory[subcategory])
      monthlyGMVPerCategory[subcategory] = {};
    if (!monthlyGMVPerCategory[subcategory][monthKey])
      monthlyGMVPerCategory[subcategory][monthKey] = 0;
    monthlyGMVPerCategory[subcategory][monthKey] += gmv;

    if (brand === brandFilter) {
      if (!monthlyGMVPerCategoryBrand[subcategory])
        monthlyGMVPerCategoryBrand[subcategory] = {};
      if (!monthlyGMVPerCategoryBrand[subcategory][monthKey])
        monthlyGMVPerCategoryBrand[subcategory][monthKey] = 0;
      monthlyGMVPerCategoryBrand[subcategory][monthKey] += gmv;
    }
  }

  const allMonths = Object.values(monthlyGMVPerCategory)
    .flatMap((obj) => Object.keys(obj))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  const latestMonth = allMonths[allMonths.length - 1];
  const prevMonth = allMonths[allMonths.length - 2];

  const formatBio = (val: number) => `${(val / 1e9).toFixed(1)} Bio`;
  const formatPct = (val: number) => `${val.toFixed(2)}%`;

  const output = [];

  for (const subcategory of Object.keys(monthlyGMVPerCategory)) {
    const marketTimeline = monthlyGMVPerCategory[subcategory];
    const brandTimeline = monthlyGMVPerCategoryBrand[subcategory] || {};

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

    let signal = "❌ Underperforming";

    if (marketGrowth < 0) {
      if (brandGrowth > 0) {
        signal = "⚠️ Resilient in Soft Market";
      } else if (brandGrowth < 0 && brandGrowth >= marketGrowth) {
        signal = "⚠️ Resilient in Soft Market";
      } else if (brandGrowth < marketGrowth) {
        signal = "❌ Underperforming";
      }
    } else {
      if (brandGrowth > 0 && brandGrowth >= marketGrowth) {
        signal = "✅ Aligned Growth";
      } else if (brandGrowth > 0 && brandGrowth < marketGrowth) {
        signal = "⚠️ Suboptimal Growth";
      } else if (brandGrowth < 0) {
        signal = "❌ Underperforming";
      }
    }

    output.push({
      Subcategory: subcategory,
      "Brand GMV (Bio)": formatBio(currentGMV),
      "Brand Share (%)": formatPct(brandShare),
      "QoQ Growth": formatPct(brandGrowth),
      "Market Growth": formatPct(marketGrowth),
      "Performance Signal": signal,
    });
  }

  console.log("Brand Performance SubCategory Data:", output);

  return {
    chartData: output,
  };
}
