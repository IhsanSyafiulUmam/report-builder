import React, { useState } from "react";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { ResizableWrapper } from "./shared";

interface ChartData {
  [key: string]: string | number;
}

interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "stacked-bar" | "sales-overview";
  data: ChartData[];
  title?: string;
  width?: number;
  height?: number;
  xKey?: string;
  yKey?: string;
  colors?: string[];
  showGrid?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
  customRenderer?: (data: ChartData[]) => React.ReactNode;
}

interface ChartComponentProps {
  config: ChartConfig;
  onChange?: (config: Partial<ChartConfig>) => void;
  isEditable?: boolean;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  config,
  onChange,
  isEditable = false,
}) => {
  const [chartType, setChartType] = useState<ChartConfig["type"]>(
    config.type || "bar"
  );
  const [chartTitle, setChartTitle] = useState(config.title || "Chart Title");

  const chartTypes = [
    { value: "bar" as const, label: "Bar Chart", icon: BarChart3 },
    { value: "line" as const, label: "Line Chart", icon: LineChart },
    { value: "pie" as const, label: "Pie Chart", icon: PieChart },
    { value: "area" as const, label: "Area Chart", icon: TrendingUp },
    { value: "stacked-bar" as const, label: "Stacked Bar", icon: BarChart3 },
    {
      value: "sales-overview" as const,
      label: "Sales Overview",
      icon: TrendingUp,
    },
  ];

  const defaultColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  const updateConfig = (updates: Partial<ChartConfig>) => {
    if (onChange) {
      const newConfig = {
        ...config,
        type: chartType,
        title: chartTitle,
        width: config.width || 500,
        height: config.height || 350,
        ...updates,
      };
      onChange(newConfig);
    }
  };

  const handleResize = (width: number, height: number) => {
    updateConfig({ width, height });
  };

  const renderChart = () => {
    if (config.customRenderer) {
      return config.customRenderer(config.data);
    }

    const chartData = config.data || [];
    const colors = config.colors || defaultColors;
    const xKey = config.xKey || Object.keys(chartData[0] || {})[0];
    const yKey = config.yKey || Object.keys(chartData[0] || {})[1];

    switch (config.type) {
      case "bar":
      case "sales-overview":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis tick={{ fontSize: 8, fill: "#6b7280" }} />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Bar dataKey={yKey} radius={[4, 4, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
                <LabelList
                  dataKey={yKey}
                  position="top"
                  style={{ fontSize: 12, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={chartData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={yKey}
                stroke={colors[0]}
                strokeWidth={2}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        );

      case "area":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              <Area
                type="monotone"
                dataKey={yKey}
                stroke={colors[0]}
                fill={colors[0]}
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={chartData}
                dataKey={yKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case "stacked-bar": {
        const dataKeys = Object.keys(chartData[0] || {}).filter(
          (key) => key !== xKey
        );
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              {config.showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#374151" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              {config.showTooltip && <Tooltip />}
              {config.showLegend && <Legend />}
              {dataKeys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={colors[index % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      }

      default:
        return (
          <div className="flex items-center justify-center h-full p-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-lg">
                <BarChart3 size={32} className="text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {chartTitle}
              </h3>
              <p className="text-sm text-gray-500">
                Chart will appear here when data is available
              </p>
            </div>
          </div>
        );
    }
  };

  const chartContent = (
    <div className="space-y-4">
      {/* Chart Configuration */}
      {isEditable && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Chart Title
            </label>
            <input
              type="text"
              value={chartTitle}
              onChange={(e) => {
                setChartTitle(e.target.value);
                updateConfig({ title: e.target.value });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => {
                const newType = e.target.value as ChartConfig["type"];
                setChartType(newType);
                updateConfig({ type: newType });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {chartTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Chart Preview */}
      {config.customRenderer ? (
        // For custom renderers, give them full control over the container but with background
        <div
          className="overflow-hidden bg-white border border-gray-200 rounded-lg"
          style={{ height: config.height || 350 }}
        >
          {config.title && (
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                {config.title}
              </h3>
            </div>
          )}
          <div
            className="p-4 overflow-hidden"
            style={{ height: config.title ? "calc(100% - 60px)" : "100%" }}
          >
            {renderChart()}
          </div>
        </div>
      ) : (
        // For standard charts, use the default container
        <div
          className="overflow-hidden bg-white border border-gray-200 rounded-lg"
          style={{ height: config.height || 350 }}
        >
          {config.title && (
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">
                {config.title || chartTitle}
              </h3>
            </div>
          )}
          <div
            className="p-4 overflow-hidden"
            style={{ height: config.title ? "calc(100% - 60px)" : "100%" }}
          >
            {renderChart()}
          </div>
        </div>
      )}

      {/* Data Source Info */}
      {isEditable && (
        <div className="p-4 rounded-lg bg-blue-50">
          <h4 className="mb-2 text-sm font-medium text-blue-900">
            Data Source
          </h4>
          <p className="text-sm text-blue-700">
            Connected to BigQuery/ClickHouse • {config.data.length} data points
            • Last updated: 2 hours ago
          </p>
          <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800">
            Configure data source →
          </button>
        </div>
      )}
    </div>
  );

  if (isEditable && onChange) {
    return (
      <ResizableWrapper
        initialWidth={config.width || 500}
        initialHeight={config.height || 350}
        minWidth={300}
        minHeight={250}
        maxWidth={1000}
        maxHeight={700}
        isEditable={isEditable}
        onResize={handleResize}
        className="mb-4"
      >
        {chartContent}
      </ResizableWrapper>
    );
  }

  return chartContent;
};

export default ChartComponent;
