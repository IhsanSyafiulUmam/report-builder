export default function processPaymentTerms(results: any, meta: unknown) {
  const paymentAnalysisData = Array.isArray(results)
    ? results
    : Array.isArray(results?.payment_analysis)
    ? results.payment_analysis
    : [];

  const paymentTrendsData = Array.isArray(results?.payment_trends)
    ? results.payment_trends
    : [];

  // Process payment terms analysis
  const paymentTermsAnalysis = paymentAnalysisData.map((item: any) => ({
    paymentTerm: item.payment_term,
    customerCategory: item.customer_category,
    orderCount: parseInt(item.order_count),
    totalSales: parseFloat(item.total_sales),
    avgOrderValue: parseFloat(item.avg_order_value),
    uniqueCustomers: parseInt(item.unique_customers),
    totalQuantity: parseInt(item.total_quantity),
    formattedSales: `Rp ${(parseFloat(item.total_sales) / 1000000).toFixed(1)}M`,
    formattedAvgOrder: `Rp ${parseFloat(item.avg_order_value).toLocaleString('id-ID')}`
  }));

  // Aggregate by payment terms
  const termsSummary: Record<string, {
    orderCount: number;
    totalSales: number;
    uniqueCustomers: number;
    customerCategories: Record<string, number>;
  }> = {};

  paymentTermsAnalysis.forEach(item => {
    const term = item.paymentTerm;
    if (!termsSummary[term]) {
      termsSummary[term] = {
        orderCount: 0,
        totalSales: 0,
        uniqueCustomers: 0,
        customerCategories: {}
      };
    }
    
    termsSummary[term].orderCount += item.orderCount;
    termsSummary[term].totalSales += item.totalSales;
    termsSummary[term].uniqueCustomers += item.uniqueCustomers;
    
    if (!termsSummary[term].customerCategories[item.customerCategory]) {
      termsSummary[term].customerCategories[item.customerCategory] = 0;
    }
    termsSummary[term].customerCategories[item.customerCategory] += item.uniqueCustomers;
  });

  // Convert to array format with calculated metrics
  const termsOverview = Object.keys(termsSummary).map(term => {
    const data = termsSummary[term];
    const avgOrderValue = data.orderCount > 0 ? data.totalSales / data.orderCount : 0;
    
    return {
      paymentTerm: term,
      orderCount: data.orderCount,
      totalSales: data.totalSales,
      uniqueCustomers: data.uniqueCustomers,
      avgOrderValue,
      formattedSales: `Rp ${(data.totalSales / 1000000).toFixed(1)}M`,
      formattedAvgOrder: `Rp ${avgOrderValue.toLocaleString('id-ID')}`,
      customerCategories: data.customerCategories
    };
  }).sort((a, b) => b.totalSales - a.totalSales);

  // Calculate payment terms distribution
  const totalSales = termsOverview.reduce((sum, term) => sum + term.totalSales, 0);
  const totalOrders = termsOverview.reduce((sum, term) => sum + term.orderCount, 0);

  const termsDistribution = termsOverview.map(term => ({
    ...term,
    salesShare: totalSales > 0 ? (term.totalSales / totalSales * 100) : 0,
    orderShare: totalOrders > 0 ? (term.orderCount / totalOrders * 100) : 0
  }));

  // Analyze customer category preferences by payment terms
  const categoryPreferences: Record<string, Record<string, number>> = {};
  
  paymentTermsAnalysis.forEach(item => {
    const category = item.customerCategory;
    const term = item.paymentTerm;
    
    if (!categoryPreferences[category]) {
      categoryPreferences[category] = {};
    }
    
    if (!categoryPreferences[category][term]) {
      categoryPreferences[category][term] = 0;
    }
    
    categoryPreferences[category][term] += item.totalSales;
  });

  // Convert to percentage preferences
  const preferenceAnalysis = Object.keys(categoryPreferences).map(category => {
    const categoryData = categoryPreferences[category];
    const categoryTotal = Object.values(categoryData).reduce((sum: number, value: number) => sum + value, 0);
    
    const preferences = Object.keys(categoryData).map(term => ({
      paymentTerm: term,
      sales: categoryData[term],
      percentage: categoryTotal > 0 ? (categoryData[term] / categoryTotal * 100) : 0
    }));
    
    return {
      customerCategory: category,
      totalSales: categoryTotal,
      preferences: preferences.sort((a, b) => b.percentage - a.percentage),
      preferredTerm: preferences.reduce((max, current) => 
        current.percentage > max.percentage ? current : max
      ).paymentTerm
    };
  });

  // Process payment trends over time
  const trendAnalysis: Record<string, any[]> = {};
  
  paymentTrendsData.forEach(trend => {
    const term = trend.payment_term;
    if (!trendAnalysis[term]) {
      trendAnalysis[term] = [];
    }
    
    trendAnalysis[term].push({
      month: trend.month,
      monthlySales: parseFloat(trend.monthly_sales),
      avgOrderValue: parseFloat(trend.avg_order_value),
      orderCount: parseInt(trend.order_count)
    });
  });

  // Sort trends by month for each payment term
  Object.keys(trendAnalysis).forEach(term => {
    trendAnalysis[term].sort((a, b) => a.month.localeCompare(b.month));
  });

  // Calculate impact analysis
  const impactAnalysis = termsDistribution.map(term => {
    let riskLevel = 'Low';
    let cashFlowImpact = 'Positive';
    
    // Risk assessment based on payment term
    if (term.paymentTerm.includes('30')) {
      riskLevel = 'High';
      cashFlowImpact = 'Delayed';
    } else if (term.paymentTerm.includes('15')) {
      riskLevel = 'Medium';
      cashFlowImpact = 'Moderate';
    }
    
    return {
      ...term,
      riskLevel,
      cashFlowImpact,
      averageCollectionPeriod: term.paymentTerm.includes('30') ? 30 : 
                               term.paymentTerm.includes('15') ? 15 : 7,
      creditExposure: term.totalSales, // Simplified - in reality would consider timing
      recommendedAction: riskLevel === 'High' ? 'Monitor closely' : 'Continue current terms'
    };
  });

  // Summary metrics
  const paymentMetrics = {
    totalPaymentTerms: termsDistribution.length,
    dominantTerm: termsDistribution[0]?.paymentTerm || 'N/A',
    riskiestTerm: impactAnalysis.find(term => term.riskLevel === 'High')?.paymentTerm || 'None',
    totalCreditExposure: impactAnalysis.reduce((sum, term) => sum + term.creditExposure, 0),
    avgOrderValueAllTerms: totalOrders > 0 ? totalSales / totalOrders : 0,
    formattedCreditExposure: `Rp ${(impactAnalysis.reduce((sum, term) => sum + term.creditExposure, 0) / 1000000000).toFixed(1)}B`
  };

  console.log("Processed payment terms data:", {
    termsOverview: termsOverview.length,
    preferenceAnalysis: preferenceAnalysis.length,
    trendAnalysis: Object.keys(trendAnalysis).length,
    paymentMetrics
  });

  return {
    chartData: {
      termsOverview,
      termsDistribution,
      preferenceAnalysis,
      trendAnalysis,
      impactAnalysis,
      paymentMetrics,
      visualizationData: {
        distributionData: termsDistribution.map(term => ({
          term: term.paymentTerm,
          sales: term.totalSales,
          percentage: parseFloat(term.salesShare.toFixed(1))
        })),
        preferencesData: preferenceAnalysis,
        trendsData: trendAnalysis
      }
    }
  };
}