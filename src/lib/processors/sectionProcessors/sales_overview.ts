export default function processSalesOverview(results: any, meta: unknown) {
  const inputData = Array.isArray(results)
    ? results
    : Array.isArray(results?.fullData)
    ? results.fullData
    : Array.isArray(results?.monthly_sales)
    ? results.monthly_sales
    : [];

  const monthMap: Record<string, string> = {
    "1": "Jan",
    "2": "Feb",
    "3": "Mar",
    "4": "Apr",
    "5": "May",
    "6": "Jun",
    "7": "Jul",
    "8": "Aug",
    "9": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };

  const gmvGroup: Record<string, number> = {};

  for (const data of inputData) {
    const [year, monthRaw] = data.Month.split("-");
    const monthNum = parseInt(monthRaw, 10).toString(); // Hilangkan leading zero
    const monthName = monthMap[monthNum] || "Unknown";
    const key = `${monthName}-${year}`;
    const totalSales = parseFloat(data.totalsales);
    gmvGroup[key] = (gmvGroup[key] || 0) + totalSales;
  }

  const monthOrder = [
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

  const result = Object.keys(gmvGroup)
    .sort((a, b) => {
      const [monthA, yearA] = a.split("-");
      const [monthB, yearB] = b.split("-");
      if (yearA !== yearB) return parseInt(yearA) - parseInt(yearB);
      return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
    })
    .map((key) => {
      const bio = (gmvGroup[key] / 1e9).toFixed(1);
      return {
        Month: key,
        "SUM of GMV": `${bio} Bio`,
      };
    });
  
  console.log("Processed sales overview data:", result);

  return {
    chartData: result,
  };
}
