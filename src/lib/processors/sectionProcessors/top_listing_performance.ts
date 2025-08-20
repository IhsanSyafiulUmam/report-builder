export default function processTopListingPerformance(
  results: any,
  meta: unknown
) {
  const items = results.top_listing_performance || [];

  const formatGMV = (value: any) => {
    const num = parseFloat(value);
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + ' Bio';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + ' Mio';
    } else {
      return num.toFixed(2);
    }
  };

  const chartData = items.map((item: any) => {
    const data = item.json || item;
    return {
      Platform: data.channel || '',
      "Listing Name": data.ListingName || '',
      "GMV (Bio)": formatGMV(data.GMV),
      "% of Brand GMV": parseFloat(data.pct_of_brand_gmv).toFixed(2) + '%',
      "QoQ Growth": parseFloat(data.qoq_growth_pct).toFixed(2) + '%',
    };
  });

  console.log("Top Listing Performance Data:", chartData);

  return {
    chartData,
  };
}
