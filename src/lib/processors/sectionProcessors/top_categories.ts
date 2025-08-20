export default function processTopCategories(results: any, meta: unknown) {
  const inputArr = Array.isArray(results.top_categories)
    ? results.top_categories
    : [];
  const grouped: Record<string, any[]> = {};
  for (const item of inputArr) {
    const channel = item.Channel || "Unknown";
    if (!grouped[channel]) grouped[channel] = [];
    grouped[channel].push(item);
  }
  const topCategories: Record<
    string,
    { insights: Array<{ title: string; body: string }>; categories: any[] }
  > = {};
  for (const channel of Object.keys(grouped)) {
    const bySubCategory: Record<string, { [month: string]: any }> = {};
    for (const item of grouped[channel]) {
      const subcat = item.SubCategory || item.category || "";
      const month = item.Month || "";
      if (!bySubCategory[subcat]) bySubCategory[subcat] = {};
      bySubCategory[subcat][month] = item;
    }
    const allMonths = Array.from(new Set(grouped[channel].map((i) => i.Month)))
      .filter(Boolean)
      .sort()
      .reverse();
    const latestMonth = allMonths[0];
    const prevMonth = allMonths[1];
    const latestItems = Object.entries(bySubCategory)
      .map(([subcat, monthMap]) => monthMap[latestMonth])
      .filter(Boolean);
    const getRankMap = (month: string) => {
      const arr = Object.entries(bySubCategory)
        .map(([subcat, monthMap]) => ({
          subcat,
          totalsales: monthMap[month]?.totalsales ?? -Infinity,
        }))
        .filter((i) => i.totalsales !== -Infinity)
        .sort((a, b) => b.totalsales - a.totalsales);
      const map: Record<string, number> = {};
      arr.forEach((item, idx) => {
        map[item.subcat] = idx + 1;
      });
      return map;
    };
    const latestRank = getRankMap(latestMonth);
    const prevRank = getRankMap(prevMonth);
    const sorted = latestItems.sort((a, b) => b.totalsales - a.totalsales);

    // Structure data with insights and categories
    topCategories[channel] = {
      insights: [], // Initialize empty insights array with proper structure
      categories: sorted.map((item: any) => {
        const subcat = item.SubCategory || item.category || "";
        // Growth: compare GMV with previous month
        const prev = bySubCategory[subcat][prevMonth];
        let growth = 0;
        if (
          prev &&
          typeof prev.totalsales === "number" &&
          prev.totalsales > 0
        ) {
          growth =
            ((item.totalsales - prev.totalsales) / prev.totalsales) * 100;
        }
        let rankChange: number | "unchanged" = "unchanged";
        if (prevRank[subcat] && latestRank[subcat]) {
          const diff = prevRank[subcat] - latestRank[subcat];
          if (diff > 0) rankChange = diff;
          else if (diff < 0) rankChange = diff;
          else rankChange = "unchanged";
        }
        return {
          category: subcat,
          gmv:
            typeof item.totalsales === "number"
              ? Number((item.totalsales / 1e9).toFixed(1))
              : 0,
          rankChange,
          growth: Number(growth.toFixed(2)),
          analysis: item.analysis || "",
        };
      }),
    };
  }

  console.log("Top Categories Data:", topCategories);
  return {
    chartData: topCategories,
  };
}
