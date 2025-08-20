import React, { useState } from "react";
import { QueryItem } from "../QueryEditor";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
} from "recharts";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import InsightManager from "../shared/InsightManager";
import ActionTitle from "../shared/ActionTitle";
import ChartComponent from "../ChartComponent";

interface PlatformSalesValueProps {
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

const colorPalette = [
  "#f97316", // orange
  "#000000", // black
  "#22c55e", // green
  "#d946ef", // purple
  "#2563eb", // blue
  "#eab308", // yellow
  "#db2777", // pink
  "#64748b", // slate
];

const platformNames: Record<string, string> = {
  Channel: "Channel",
  Shopee: "Shopee",
  TikTok: "TikTok",
  Tokopedia: "Tokopedia",
  "TikTok x Tokopedia": "TikTok x Tokopedia",
};

const PlatformSalesValueSection: React.FC<PlatformSalesValueProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const queries = section.content.queries || [];
  const insights = section.content.insights || [];
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const rawData = section.content.chartData || [];

  const handleQueryEditorChange = (newQueries: QueryItem[]) => {
    onUpdate({ content: { ...section.content, queries: newQueries } });
  };

  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
  };

  const platformKeys =
    rawData.length > 0
      ? Object.keys(rawData[0]).filter((k) => k !== "Month" && k !== "month")
      : [];

  const colors: Record<string, string> = {};
  platformKeys.forEach((key, idx) => {
    colors[key] = colorPalette[idx % colorPalette.length];
  });

  const [selectedPlatforms, setSelectedPlatforms] =
    useState<string[]>(platformKeys);

  const platformData = rawData.map((row) => {
    const out: Record<string, number | string> = {
      month: row.Month || row.month,
    };
    platformKeys.forEach((key) => {
      const val = row[key];
      if (typeof val === "string" && val !== "-") {
        out[key] = parseFloat(val.replace(" Bio", ""));
      } else if (typeof val === "number") {
        out[key] = val;
      } else {
        out[key] = 0;
      }
    });
    return out;
  });

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

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

  const renderPlatformChart = (data: Record<string, unknown>[]) => {
    return (
      <div className="space-y-6">
        {/* Platform Toggle Buttons */}
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <div className="flex flex-wrap gap-1">
            {platformKeys.map((key) => (
              <button
                key={key}
                onClick={() => togglePlatform(key)}
                onMouseEnter={() => setHoveredLine(key)}
                onMouseLeave={() => setHoveredLine(null)}
                className={`flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                  selectedPlatforms.includes(key)
                    ? "bg-white text-gray-800 shadow-lg shadow-gray-200/50 border border-gray-200"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                } hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedPlatforms.includes(key) ? "shadow-lg" : "opacity-60"
                  }`}
                  style={{
                    backgroundColor: colors[key],
                    boxShadow: selectedPlatforms.includes(key)
                      ? `0 0 0 2px ${colors[key]}20`
                      : "none",
                  }}
                />
                <span className="font-medium">{platformNames[key] || key}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container with elegant styling */}
        <div className="relative p-2 border border-gray-100 shadow-sm bg-gradient-to-br from-gray-50/50 to-white rounded-2xl">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
              >
                {/* Gradient definitions */}
                <defs>
                  {platformKeys.map((key) => (
                    <linearGradient
                      key={`gradient-${key}`}
                      id={`gradient-${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={colors[key]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="100%"
                        stopColor={colors[key]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  ))}
                </defs>

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 8,
                    fill: "#64748b",
                    fontWeight: 500,
                    fontFamily: "Helvetica, Helvetica Neue, Arial, sans-serif",
                  }}
                  dy={10}
                  className="text-slate-600"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 8,
                    fill: "#64748b",
                    fontWeight: 500,
                    fontFamily: "Helvetica, Helvetica Neue, Arial, sans-serif",
                  }}
                  tickFormatter={(value) => `${value} Bio`}
                  width={40}
                  className="text-slate-600"
                />

                {/* Custom grid lines */}
                <defs>
                  <pattern
                    id="grid"
                    width="1"
                    height="1"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 1 0 L 0 0 0 1"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 min-w-[100px]">
                          <p className="pb-1 mb-2 text-xs font-semibold text-gray-800 border-b border-gray-100">
                            {label}
                          </p>
                          <div className="space-y-2">
                            {payload
                              .filter((entry) =>
                                selectedPlatforms.includes(
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
                                      className="w-1 h-1 rounded-full shadow-sm"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-xs font-medium text-gray-700">
                                      {platformNames[entry.dataKey as string] ||
                                        entry.dataKey}
                                    </span>
                                  </div>
                                  <span className="text-xs font-bold text-gray-900">
                                    {entry.value} Bio
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

                {platformKeys.map((key) => {
                  const color = colors[key];
                  const isSelected = selectedPlatforms.includes(key);
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
                        className: "drop-shadow-sm",
                      }}
                      activeDot={{
                        r: 6,
                        fill: color,
                        stroke: "#ffffff",
                        strokeWidth: 1,
                        className: "drop-shadow-lg",
                        style: {
                          filter: `drop-shadow(0 2px 4px ${color}40)`,
                        },
                      }}
                      strokeDasharray={isHovered ? "0" : "0"}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subtle background pattern */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-gray-50/20 to-transparent rounded-2xl" />
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
          title={section.content.actionTitle || "Platform Sales Performance"}
          subheadline={section.content.subheadline || ""}
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
              type: "line",
              data: platformData,
              title: "Platform Sales Performance",
              width: 800,
              height: 360,
              xKey: "month",
              yKey: platformKeys[0],
              colors: Object.values(colors),
              showGrid: true,
              showTooltip: true,
              showLegend: false,
              customRenderer: renderPlatformChart,
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

export default PlatformSalesValueSection;
