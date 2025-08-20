
const formatGMV = (value: string): string => {
  const num = parseFloat(value);
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + " Bio";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + " Mio";
  } else {
    return num.toFixed(2);
  }
};

const formatCurrencyK = (value: string): string => {
  const num = parseInt(value, 10);
  if (num >= 1000) {
    return "IDR " + Math.round(num / 1000) + "K";
  } else {
    return "IDR " + num;
  }
};

export default async function processTopReseller(
 results: any, meta: unknown
) {
  const inputData = results.top_reseller;

  const chartData = inputData.map((item: any) => {
    return {
      ShopName: item.ShopName,
      Province: item.Province,
      Channel: item.Channel,
      ShopUrl: item.ShopUrl,
      "Total Sales": formatGMV(item.Gmv),
      "Units Sold": String(parseInt(item.UnitSold, 10)),
      "AVG Sale Price": formatCurrencyK(item.avgSalePrice),
    };
  });

  return { chartData };
}
