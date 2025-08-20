export default function processPlatformSales(results: any, meta: unknown) {
  const inputData = results.platform_gmv;

  const formatMonth = (monthStr: string) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const [year, month] = monthStr.split("-");
    return `${months[parseInt(month, 10) - 1]}-${year}`;
  };

  const aggregated: Record<string, Record<string, number>> = {};
  const channelsSet = new Set<string>();

  for (const entry of inputData) {
    const monthLabel = formatMonth(entry.Month);
    const channel = entry.Channel;
    const sales = parseFloat(entry.totalsales);

    channelsSet.add(channel);

    if (!aggregated[monthLabel]) aggregated[monthLabel] = {};
    if (!aggregated[monthLabel][channel]) aggregated[monthLabel][channel] = 0;
    aggregated[monthLabel][channel] += sales;
  }

  const formatToBio = (value: number) => `${(value / 1e9).toFixed(1)} Bio`;

  const monthsSorted = Object.keys(aggregated).sort((a, b) => {
    const parseMonthYear = (str: string) => {
      const [mon, year] = str.split("-");
      const monthIndex = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].indexOf(mon);
      return new Date(parseInt(year), monthIndex, 1).getTime();
    };
    return parseMonthYear(a) - parseMonthYear(b);
  });

  const channels = Array.from(channelsSet);

  const result = monthsSorted.map((month) => {
    const row: Record<string, string> = { Month: month };
    for (const channel of channels) {
      const value = aggregated[month][channel] || 0;
      row[channel] = value > 0 ? formatToBio(value) : "-";
    }
    return row;
  });

  console.log("Processed platform sales data:", result);


  return {
    chartData: result,
  };
}
