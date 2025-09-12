interface Meta {
  brandFilter?: string;
}

export default function processBrandPerformanceSubCategory(
  results: any,
  meta: Meta
) {
  const data = results.brand_performance_sub_category;
  const brandFilter = meta.brandFilter || "Sunsilk";

  const monthlyGMVPerCategory: Record<string, Record<string, number>> = {};
  const monthlyGMVPerCategoryBrand: Record<string, Record<string, number>> = {};

  for (const row of data) {
    const subcategory = row.SubCategory;
    const brand = row.Brand;
    const monthKey = row.Month;
    const gmv = parseFloat(row.totalsales);

    if (!monthlyGMVPerCategory[subcategory]) monthlyGMVPerCategory[subcategory] = {};
    if (!monthlyGMVPerCategory[subcategory][monthKey]) monthlyGMVPerCategory[subcategory][monthKey] = 0;
    monthlyGMVPerCategory[subcategory][monthKey] += gmv;

    if (brand === brandFilter) {
      if (!monthlyGMVPerCategoryBrand[subcategory]) monthlyGMVPerCategoryBrand[subcategory] = {};
      if (!monthlyGMVPerCategoryBrand[subcategory][monthKey]) monthlyGMVPerCategoryBrand[subcategory][monthKey] = 0;
      monthlyGMVPerCategoryBrand[subcategory][monthKey] += gmv;
    }
  }

  const allMonths = Object.values(monthlyGMVPerCategory)
    .flatMap((obj) => Object.keys(obj))
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();

  const latestMonth = allMonths[allMonths.length - 1];
  const prevMonth = allMonths[allMonths.length - 2];

  const formatGMV = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(2)} Bio`;
    if (val >= 1e6) return `${(val / 1e6).toFixed(0)} Mio`;
    if (val >= 1e3) return `${(val / 1e3).toFixed(0)} K`;
    return `${val.toFixed(0)}`;
  };

  const formatPct = (val: number | null) =>
    val === null ? "-" : `${val.toFixed(2)}%`;

  const output: any[] = [];

  for (const subcategory of Object.keys(monthlyGMVPerCategoryBrand)) {
    const marketTimeline = monthlyGMVPerCategory[subcategory] || {};
    const brandTimeline = monthlyGMVPerCategoryBrand[subcategory] || {};

    const currentMarketGMV = marketTimeline[latestMonth] || 0;
    const prevMarketGMV = marketTimeline[prevMonth] || 0;

    const currentGMV = brandTimeline[latestMonth] || 0;
    const prevGMV = brandTimeline[prevMonth] || 0;

    if (currentGMV === 0) continue;

    const brandShare = currentMarketGMV > 0 ? (currentGMV / currentMarketGMV) * 100 : 0;
    const brandGrowth = prevGMV > 0 ? ((currentGMV - prevGMV) / prevGMV) * 100 : null;
    const marketGrowth = prevMarketGMV > 0 ? ((currentMarketGMV - prevMarketGMV) / prevMarketGMV) * 100 : null;

    let signal = "❌ Underperforming";

    if (marketGrowth !== null && brandGrowth !== null) {
      if (marketGrowth < 0) {
        if (brandGrowth > 0 || (brandGrowth < 0 && brandGrowth >= marketGrowth)) {
          signal = "⚠️ Resilient in Soft Market";
        }
      } else {
        if (brandGrowth > 0 && brandGrowth >= marketGrowth) {
          signal = "✅ Aligned Growth";
        } else if (brandGrowth > 0 && brandGrowth < marketGrowth) {
          signal = "⚠️ Suboptimal Growth";
        }
      }
    }

    output.push({
      Subcategory: subcategory,
      "Brand GMV": formatGMV(currentGMV),
      "Brand Share (%)": formatPct(brandShare),
      "MoM Growth": formatPct(brandGrowth),
      "Market Growth": formatPct(marketGrowth),
      "Performance Signal": signal,
      _rawGMV: currentGMV,
    });
  }

  const sortedOutput = output.sort((a, b) => b._rawGMV - a._rawGMV).map(({ _rawGMV, ...rest }) => rest);

  return {
    chartData: sortedOutput,
  };
}
