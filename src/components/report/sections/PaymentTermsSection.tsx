import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  ComposedChart,
  Legend,
} from "recharts";
import { BaseSectionLayout, InsightManager, ActionTitle, SlideContainer } from "../shared";
import ChartComponent from "../ChartComponent";
import { QueryItem } from "../QueryEditor";

interface PaymentTermsSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      termsOverview?: Array<{
        paymentTerm: string;
        orderCount: number;
        totalSales: number;
        uniqueCustomers: number;
        avgOrderValue: number;
        formattedSales: string;
        formattedAvgOrder: string;
        customerCategories: Record<string, number>;
      }>;
      termsDistribution?: Array<{
        paymentTerm: string;
        orderCount: number;
        totalSales: number;
        salesShare: number;
        orderShare: number;
        formattedSales: string;
      }>;
      preferenceAnalysis?: Array<{
        customerCategory: string;
        totalSales: number;
        preferences: Array<{
          paymentTerm: string;
          sales: number;
          percentage: number;
        }>;
        preferredTerm: string;
      }>;
      trendAnalysis?: Record<string, Array<{
        month: string;
        monthlySales: number;
        avgOrderValue: number;
        orderCount: number;
      }>>;
      impactAnalysis?: Array<{
        paymentTerm: string;
        riskLevel: string;
        cashFlowImpact: string;
        averageCollectionPeriod: number;
        creditExposure: number;
        recommendedAction: string;
        salesShare: number;
      }>;
      paymentMetrics?: {
        totalPaymentTerms: number;
        dominantTerm: string;
        riskiestTerm: string;
        totalCreditExposure: number;
        avgOrderValueAllTerms: number;
        formattedCreditExposure: string;
      };
      chartData?: {
        distributionData: Array<any>;
        preferencesData: Array<any>;
        trendsData: Record<string, Array<any>>;
      };
      insights?: Array<{ title: string; body: string }>;
      queries?: QueryItem[];
    };
  };
  onUpdate: (updates: {
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      insights?: Array<{ title: string; body: string }>;
      queries?: QueryItem[];
    };
  }) => void;
  isEditable?: boolean;
}

const PaymentTermsSection: React.FC<PaymentTermsSectionProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'preferences' | 'trends' | 'risk'>('overview');

  const {
    termsOverview = [],
    termsDistribution = [],
    preferenceAnalysis = [],
    trendAnalysis = {},
    impactAnalysis = [],
    paymentMetrics = {
      totalPaymentTerms: 0,
      dominantTerm: 'N/A',
      riskiestTerm: 'N/A',
      totalCreditExposure: 0,
      avgOrderValueAllTerms: 0,
      formattedCreditExposure: 'Rp 0'
    },
    chartData = {
      distributionData: [],
      preferencesData: [],
      trendsData: {}
    },
    insights = [],
    queries = []
  } = section.content;

  const handleQueryEditorChange = (newQueries: QueryItem[]) => {
    onUpdate({ content: { ...section.content, queries: newQueries } });
  };

  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
  };

  const handleAddInsight = () => {
    const newInsights = [
      ...insights,
      { title: "New Payment Terms Insight", body: "Payment terms analysis description" },
    ];
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  const handleEditInsight = (
    idx: number,
    field: "title" | "body",
    value: string
  ) => {
    const newInsights = insights.map((ins, i) =>
      i === idx ? { ...ins, [field]: value } : ins
    );
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  const handleDeleteInsight = (idx: number) => {
    const newInsights = insights.filter((_, i) => i !== idx);
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  // Chart colors
  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'];
  const RISK_COLORS = { 'High': '#ef4444', 'Medium': '#eab308', 'Low': '#22c55e' };

  const distributionChart = chartData.distributionData.map((term, index) => ({
    ...term,
    fill: COLORS[index % COLORS.length],
    salesInMillion: term.sales / 1000000
  }));

  const riskChart = impactAnalysis.map((term, index) => ({
    ...term,
    creditExposureInMillion: term.creditExposure / 1000000,
    fill: RISK_COLORS[term.riskLevel as keyof typeof RISK_COLORS] || COLORS[index % COLORS.length]
  }));

  const renderDistributionChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="percentage"
          label={({ term, percentage }: any) => `${term}: ${percentage}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value: any, name: any, props: any) => [
          `${value}%`,
          `${props.payload.term} Sales Share`
        ]} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderTermsOverviewChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
        <XAxis dataKey="paymentTerm" />
        <YAxis tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} />
        <Tooltip
          formatter={(value: any, name: any, props: any) => [
            props.payload.formattedSales,
            'Total Sales'
          ]}
        />
        <Bar
          dataKey="totalSales"
          radius={[4, 4, 0, 0]}
          onMouseEnter={(_, i) => setHoveredBar(i)}
          onMouseLeave={() => setHoveredBar(null)}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={hoveredBar === index ? "#dc2626" : "#ef4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPreferencesChart = (data: any[]) => {
    const chartData = data.map(category => ({
      category: category.customerCategory,
      ...category.preferences.reduce((acc: any, pref: any) => {
        acc[pref.paymentTerm] = pref.percentage;
        return acc;
      }, {})
    }));

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
          <XAxis dataKey="category" />
          <YAxis tickFormatter={(val) => `${val}%`} />
          <Tooltip formatter={(value: any) => [`${value}%`, 'Preference']} />
          <Legend />
          {termsOverview.map((term, index) => (
            <Bar
              key={term.paymentTerm}
              dataKey={term.paymentTerm}
              fill={COLORS[index % COLORS.length]}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderTrendsChart = (data: Record<string, any[]>) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} />
        <Tooltip formatter={(value: any) => `Rp ${(value / 1000000).toFixed(1)}M`} />
        <Legend />
        {Object.keys(data).map((term, index) => (
          <Line
            key={term}
            type="monotone"
            data={data[term]}
            dataKey="monthlySales"
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            name={term}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderRiskChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
        <XAxis dataKey="paymentTerm" />
        <YAxis yAxisId="exposure" orientation="left" tickFormatter={(val) => `${val}M`} />
        <YAxis yAxisId="period" orientation="right" tickFormatter={(val) => `${val}d`} />
        <Tooltip
          formatter={(value: any, name: any) => [
            name === 'creditExposureInMillion' ? `Rp ${value}M` : `${value} days`,
            name === 'creditExposureInMillion' ? 'Credit Exposure' : 'Collection Period'
          ]}
        />
        <Legend />
        <Bar yAxisId="exposure" dataKey="creditExposureInMillion" name="Credit Exposure (M)">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
        <Line
          yAxisId="period"
          type="monotone"
          dataKey="averageCollectionPeriod"
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ r: 5 }}
          name="Collection Period (Days)"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <SlideContainer>
      <BaseSectionLayout
        queries={queries}
        isEditable={isEditable}
        onQueryChange={handleQueryEditorChange}
        channels={[]}
        showFooter={true}
      >
      <div className="p-8">
        {/* Action Title */}
        <div className="mb-8 group">
          <ActionTitle
            title={section.content.actionTitle || "Payment Terms Analysis"}
            subheadline={section.content.subheadline}
            isEditable={isEditable}
            onEditTitle={handleActionTitleChange}
            onEditSubheadline={handleSubheadlineChange}
          />
        </div>

        {/* Two-Column Layout: Chart + Insights */}
        <div className="lg:grid lg:grid-cols-5 gap-8">
          {/* Charts (60% width on desktop) */}
          <div className="lg:col-span-3">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{paymentMetrics.totalPaymentTerms}</div>
                <div className="text-xs text-blue-500">Payment Terms</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-green-600">{paymentMetrics.dominantTerm}</div>
                <div className="text-xs text-green-500">Dominant Term</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-orange-600">{paymentMetrics.formattedCreditExposure}</div>
                <div className="text-xs text-orange-500">Credit Exposure</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-lg font-bold text-red-600">{paymentMetrics.riskiestTerm}</div>
                <div className="text-xs text-red-500">Highest Risk</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'preferences', label: 'Preferences' },
                { key: 'trends', label: 'Trends' },
                { key: 'risk', label: 'Risk Analysis' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 font-medium ${
                    activeTab === tab.key
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Chart Container with Standard Styling */}
            <div className="relative p-4 border border-gray-100 shadow-sm bg-white rounded-2xl h-80">
              {activeTab === 'overview' && (
                <ChartComponent
                  config={{
                    type: "terms-overview",
                    data: termsOverview,
                    title: "Sales by Payment Terms",
                    width: 800,
                    height: 320,
                    customRenderer: renderTermsOverviewChart,
                  }}
                  isEditable={false}
                />
              )}
              
              {activeTab === 'preferences' && (
                <ChartComponent
                  config={{
                    type: "customer-preferences",
                    data: preferenceAnalysis,
                    title: "Customer Category Preferences",
                    width: 800,
                    height: 320,
                    customRenderer: renderPreferencesChart,
                  }}
                  isEditable={false}
                />
              )}
              
              {activeTab === 'trends' && Object.keys(trendAnalysis).length > 0 && (
                <ChartComponent
                  config={{
                    type: "payment-trends",
                    data: trendAnalysis,
                    title: "Payment Terms Trends Over Time",
                    width: 800,
                    height: 320,
                    customRenderer: renderTrendsChart,
                  }}
                  isEditable={false}
                />
              )}
              
              {activeTab === 'risk' && (
                <ChartComponent
                  config={{
                    type: "risk-analysis",
                    data: riskChart,
                    title: "Credit Risk Analysis",
                    width: 800,
                    height: 320,
                    customRenderer: renderRiskChart,
                  }}
                  isEditable={false}
                />
              )}
            </div>
          </div>

          {/* Insights (40% width on desktop) */}
          <div className="lg:col-span-2">
            <InsightManager
              insights={insights}
              isEditable={isEditable}
              onAddInsight={handleAddInsight}
              onEditInsight={handleEditInsight}
              onDeleteInsight={handleDeleteInsight}
            />
            
            {/* Payment Terms Insights */}
            <div className="mt-6 space-y-3">
              {activeTab === 'overview' && termsDistribution.length > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium">Terms Breakdown:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {termsDistribution.map(term => (
                      <div key={term.paymentTerm}>
                        {term.paymentTerm}: {term.salesShare.toFixed(1)}% of sales
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'preferences' && preferenceAnalysis.length > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium">Preferred Terms:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {preferenceAnalysis.map(category => (
                      <div key={category.customerCategory}>
                        {category.customerCategory}: {category.preferredTerm}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'risk' && impactAnalysis.length > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium">Risk Summary:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded mr-1 bg-red-500"></span>
                      High Risk: {impactAnalysis.filter(term => term.riskLevel === 'High').length}
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded mr-1 bg-yellow-500"></span>
                      Medium Risk: {impactAnalysis.filter(term => term.riskLevel === 'Medium').length}
                    </div>
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded mr-1 bg-green-500"></span>
                      Low Risk: {impactAnalysis.filter(term => term.riskLevel === 'Low').length}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'trends' && Object.keys(trendAnalysis).length > 0 && (
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm font-medium">Trend Analysis:</div>
                  <div className="text-xs text-gray-600">
                    {Object.keys(trendAnalysis).length} payment terms tracked over time
                  </div>
                </div>
              )}
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm font-medium">Cash Flow Impact:</div>
                <div className="text-xs text-gray-600 space-y-1">
                  {impactAnalysis.map(term => (
                    <div key={term.paymentTerm} className="flex justify-between">
                      <span>{term.paymentTerm}:</span>
                      <span className={`${
                        term.cashFlowImpact === 'Positive' ? 'text-green-600' : 
                        term.cashFlowImpact === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {term.cashFlowImpact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </BaseSectionLayout>
    </SlideContainer>
  );
};

export default PaymentTermsSection;