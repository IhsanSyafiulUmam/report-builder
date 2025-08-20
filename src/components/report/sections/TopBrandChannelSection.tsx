import React, { useState } from "react";
import { QueryItem } from "../QueryEditor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import InsightManager from "../shared/InsightManager";
import ActionTitle from "../shared/ActionTitle";
import ChartComponent from "../ChartComponent";

interface TopBrandChannelProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData: Array<Record<string, string | number>>;
      insights?: Array<{ title: string; body: string }>;
      queries?: QueryItem[];
    };
  };
  onUpdate: (updates: {
    content: {
      text?: string;
      actionTitle?: string;
      subheadline?: string;
      insights?: Array<{ title: string; body: string }>;
      queries?: QueryItem[];
    };
  }) => void;
  isEditable?: boolean;
}

const channelColors: Record<string, string> = {
  Shopee: "#ff6b35",
  TikTok: "#000000", 
  Tokopedia: "#03ac0e",
  "Official Store": "#2563eb",
  "Marketplace": "#7c3aed",
};

const brandColors = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
  "#84cc16", // lime
  "#f97316", // orange
  "#06b6d4", // cyan
];

const TopBrandChannelSection: React.FC<TopBrandChannelProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const queries = section.content.queries || [];
  const insights = section.content.insights || [];
  const rawData = section.content.chartData || [];
  const [selectedChannel, setSelectedChannel] = useState<string>("Shopee");

  const handleQueryEditorChange = (newQueries: QueryItem[]) => {
    onUpdate({ content: { ...section.content, queries: newQueries } });
  };

  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
  };

  // Get available channels from data
  const channels = rawData.length > 0 
    ? Array.from(new Set(rawData.map(row => row.Channel as string)))
    : ["Shopee", "TikTok", "Tokopedia"];

  // Process data for selected channel
  const channelData = rawData
    .filter(row => row.Channel === selectedChannel)
    .map((row, index) => ({
      brand: row.Brand || row.brand || `Brand ${index + 1}`,
      value: typeof row.Value === 'string' 
        ? parseFloat(row.Value.replace(/[^\d.-]/g, '')) 
        : (row.Value as number) || 0,
      percentage: row.Percentage || row.percentage || 0,
      color: brandColors[index % brandColors.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 brands

  const handleAddInsight = () => {
    const newInsights = [
      ...insights,
      { title: "New Insight", body: "Description" },
    ];
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  const handleEditInsight = (
    idx: number,
    field: "title" | "body",
    value: string
  ) => {
    const newInsights = [...insights];
    newInsights[idx] = { ...newInsights[idx], [field]: value };
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  const handleDeleteInsight = (idx: number) => {
    const newInsights = insights.filter((_, i) => i !== idx);
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  const renderBrandChart = () => {
    return (
      <div className="space-y-6">
        {/* Channel Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <div className="flex flex-wrap gap-1">
            {channels.map((channel) => (
              <button
                key={channel}
                onClick={() => setSelectedChannel(channel)}
                className={`flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedChannel === channel
                    ? "bg-white text-gray-800 shadow-lg shadow-gray-200/50 border border-gray-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                } hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedChannel === channel ? "shadow-lg" : "opacity-60"
                  }`}
                  style={{
                    backgroundColor: channelColors[channel] || "#6b7280",
                    boxShadow: selectedChannel === channel
                      ? `0 0 0 2px ${channelColors[channel] || "#6b7280"}20`
                      : "none",
                  }}
                />
                <span className="font-medium">{channel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative p-4 border border-gray-100 shadow-sm bg-gradient-to-br from-gray-50/50 to-white rounded-2xl">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={channelData}
                margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                layout="horizontal"
              >
                <XAxis 
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#64748b",
                    fontWeight: 500,
                    fontFamily: "Helvetica, Helvetica Neue, Arial, sans-serif",
                  }}
                  tickFormatter={(value) => `${value}B`}
                />
                <YAxis 
                  type="category"
                  dataKey="brand"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: "#64748b",
                    fontWeight: 500,
                    fontFamily: "Helvetica, Helvetica Neue, Arial, sans-serif",
                  }}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 min-w-[120px]">
                          <p className="pb-1 mb-2 text-xs font-semibold text-gray-800 border-b border-gray-100">
                            {label}
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-xs font-medium text-gray-700">
                                Value:
                              </span>
                              <span className="text-xs font-bold text-gray-900">
                                {data.value}B
                              </span>
                            </div>
                            {data.percentage && (
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-xs font-medium text-gray-700">
                                  Share:
                                </span>
                                <span className="text-xs font-bold text-gray-900">
                                  {data.percentage}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  className="transition-all duration-300"
                >
                  {channelData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="transition-opacity duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brand Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {channelData.slice(0, 6).map((brand, index) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm shadow-sm"
                style={{ backgroundColor: brand.color }}
              />
              <span className="font-medium text-gray-700 truncate">
                {brand.brand}
              </span>
              <span className="ml-auto font-bold text-gray-900">
                {brand.value}B
              </span>
            </div>
          ))}
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
    >
      {/* Action Title */}
      <div className="mb-8 group">
        <ActionTitle
          title={section.content.actionTitle || "Top Brand on Each Channel"}
          subheadline={section.content.subheadline || "Brand performance analysis across different channels"}
          isEditable={isEditable}
          onEditTitle={handleActionTitleChange}
          onEditSubheadline={handleSubheadlineChange}
        />
      </div>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5">
        {/* Chart Section */}
        <div className="overflow-hidden lg:col-span-3">
          <ChartComponent
            config={{
              type: "bar",
              data: channelData,
              title: `Top Brands - ${selectedChannel}`,
              width: 800,
              height: 400,
              xKey: "brand",
              yKey: "value",
              colors: brandColors,
              showGrid: true,
              showTooltip: true,
              showLegend: false,
              customRenderer: renderBrandChart,
            }}
            isEditable={false}
          />
        </div>

        {/* Insights Section */}
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

export default TopBrandChannelSection;
