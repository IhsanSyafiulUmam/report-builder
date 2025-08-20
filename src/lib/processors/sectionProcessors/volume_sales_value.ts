function normalizeVolumeLabel(label: string): string {
  return label
    .replace(/\s+/g, "")
    .replace("/gr", "")
    .replace("ml", "ml")
    .replace("ML", "ml")
    .replace("+", "+")
    .replace("<", "<")
    .replace(">", ">")
    .replace(/[^\w<>+\-]/g, "");
}
function formatMonthShort(ym: string) {
  const [year, month] = ym.split("-");
  const date = new Date(`${year}-${month}-01`);
  return date.toLocaleString("en-US", { month: "short" });
}

export default function processVolumeSalesValue(results: any, meta: unknown) {
  const input = results?.volume_sales_value || [];
  const monthMap: Record<string, Record<string, number>> = {};
  for (const row of input) {
    const month = row.Month;
    const label = normalizeVolumeLabel(row.volume_range || "");
    if (!label) continue;
    if (!monthMap[month]) monthMap[month] = {};
    monthMap[month][label] = +(row.totalsales / 1e9).toFixed(1);
  }
  const result = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, values]) => {
      return {
        month: formatMonthShort(month),
        ...values,
      };
    });

    console.log("Processed Volume Sales Value Data:", result);
  return { chartData: result };
}
