import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { BaseSectionLayout, InsightManager, ActionTitle } from "../shared";
import ChartComponent from "../ChartComponent";
import { QueryItem } from "../QueryEditor";

interface ChartDataItem {
  Month: string;
  [key: string]: string | number;
}

interface SeasonalPatternsSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData?: ChartDataItem[];
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

const colorPalette = [
  "#16a34a", // green
  "#dc2626", // red
  "#2563eb", // blue
  "#ea580c", // orange
  "#7c3aed", // purple
  "#0891b2", // cyan
  "#be185d", // pink
  "#059669", // emerald
];

const SeasonalPatternsSection: React.FC<SeasonalPatternsSectionProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const { chartData = [], insights = [], queries = [] } = section.content;
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

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
      {
        title: "Product Order Insight",
        body: "Analysis of seasonal order patterns and product demand trends",
      },
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

  // Get product keys (exclude Month and month_sort)
  const productKeys =
    chartData.length > 0
      ? Object.keys(chartData[0]).filter(
          (k) => k !== "Month" && k !== "month_sort"
        )
      : [];

  // Create color mapping for products
  const colors: Record<string, string> = {};
  productKeys.forEach((key, idx) => {
    colors[key] = colorPalette[idx % colorPalette.length];
  });

  const [selectedProducts, setSelectedProducts] =
    useState<string[]>(productKeys);

  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  // Transform data for chart
  const transformedData = chartData.map((item) => {
    const result: Record<string, string | number> = {
      Month: item.Month,
    };

    productKeys.forEach((product) => {
      const value = item[product];
      result[product] = typeof value === "number" ? value : 0;
    });

    return result;
  });

  const renderProductChart = (data: Record<string, unknown>[]) => {
    return (
      <div className="space-y-6">
        {/* Product Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <div className="flex flex-wrap gap-1">
            {productKeys.map((key) => (
              <button
                key={key}
                onClick={() => toggleProduct(key)}
                onMouseEnter={() => setHoveredLine(key)}
                onMouseLeave={() => setHoveredLine(null)}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedProducts.includes(key)
                    ? "bg-white text-gray-800 shadow-lg shadow-gray-200/50 border border-gray-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                } hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedProducts.includes(key) ? "shadow-lg" : "opacity-60"
                  }`}
                  style={{
                    backgroundColor: colors[key],
                    boxShadow: selectedProducts.includes(key)
                      ? `0 0 0 2px ${colors[key]}20`
                      : "none",
                  }}
                />
                <span
                  className="font-medium truncate max-w-[120px]"
                  title={key}
                >
                  {key.length > 15 ? `${key.substring(0, 15)}...` : key}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <XAxis
                  dataKey="Month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                    fontWeight: 500,
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                    fontWeight: 500,
                  }}
                  tickFormatter={(value) => `${Math.round(value)}`}
                  width={50}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 min-w-[200px]">
                          <p className="pb-1 mb-2 text-sm font-semibold text-gray-800 border-b border-gray-100">
                            {label}
                          </p>
                          <div className="space-y-2">
                            {payload
                              .filter((entry) =>
                                selectedProducts.includes(
                                  entry.dataKey as string
                                )
                              )
                              .map((entry, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2 h-2 rounded-full shadow-sm"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span
                                      className="text-xs font-medium text-gray-700 truncate max-w-[120px]"
                                      title={entry.dataKey as string}
                                    >
                                      {entry.dataKey as string}
                                    </span>
                                  </div>
                                  <span className="text-xs font-bold text-gray-900">
                                    {Math.round(Number(entry.value))} orders
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <ReferenceLine
                  y={0}
                  stroke="#e2e8f0"
                  strokeDasharray="2 4"
                  strokeOpacity={0.6}
                />

                {productKeys.map((key) => {
                  const color = colors[key];
                  const isSelected = selectedProducts.includes(key);
                  const isHovered = hoveredLine === key;

                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={isHovered ? 4 : isSelected ? 3 : 0}
                      strokeOpacity={isSelected ? 1 : 0}
                      dot={{
                        fill: color,
                        stroke: "#ffffff",
                        strokeWidth: 2,
                        r: isSelected ? 4 : 0,
                      }}
                      activeDot={{
                        r: 6,
                        fill: color,
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  return (
    <BaseSectionLayout
      queries={queries}
      isEditable={isEditable}
      onQueryChange={handleQueryEditorChange}
      channels={[]}
      showFooter={true}
    >
      {/* Action Title */}
      <div className="mb-8 group">
        <ActionTitle
          title={section.content.actionTitle || "Product Order Trends"}
          subheadline={section.content.subheadline}
          isEditable={isEditable}
          onEditTitle={handleActionTitleChange}
          onEditSubheadline={handleSubheadlineChange}
        />
      </div>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5">
        {/* Chart */}
        <div className="lg:col-span-3">
          <ChartComponent
            config={{
              type: "line",
              data: transformedData,
              title: "Monthly Product Order Patterns",
              width: 800,
              height: 400,
              xKey: "Month",
              yKey: productKeys[0] || "value",
              colors: Object.values(colors),
              showGrid: true,
              showTooltip: true,
              showLegend: false,
              customRenderer: renderProductChart,
            }}
            isEditable={false}
          />
        </div>

        {/* Insight */}
        <div className="lg:col-span-2">
          <InsightManager
            insights={insights}
            isEditable={isEditable}
            onAddInsight={handleAddInsight}
            onEditInsight={handleEditInsight}
            onDeleteInsight={handleDeleteInsight}
          />
        </div>
      </div>
    </BaseSectionLayout>
  );
};

export default SeasonalPatternsSection;
