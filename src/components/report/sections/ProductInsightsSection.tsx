import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { BaseSectionLayout, InsightManager, ActionTitle } from "../shared";
import ChartComponent from "../ChartComponent";
import { QueryItem } from "../QueryEditor";

interface ProductInsightsSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData: { Product: string; [key: string]: string }[];
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

const ProductInsightsSection: React.FC<ProductInsightsSectionProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const chartData = section.content.chartData || [];
  const insights = section.content.insights || [];
  const queries = section.content.queries || [];

  const handleQueryEditorChange = (newQueries: QueryItem[]) => {
    onUpdate({ content: { ...section.content, queries: newQueries } });
  };

  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
  };

  const productData = chartData.map(
    (row: { Product: string; [key: string]: string }) => {
      // Extract numeric value from "Rp 50.0M" format, similar to salesData processing
      const value = row["Total Revenue"]
        ? parseFloat(
            row["Total Revenue"].replace(/[^\d.]/g, "").replace("M", "")
          )
        : 0;
      return {
        product: row.Product,
        value,
        label: row["Total Revenue"] || `${value}M`,
      };
    }
  );

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
    const newInsights = insights.map((ins, i) =>
      i === idx ? { ...ins, [field]: value } : ins
    );
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  const handleDeleteInsight = (idx: number) => {
    const newInsights = insights.filter((_, i) => i !== idx);
    onUpdate({ content: { ...section.content, insights: newInsights } });
  };

  const renderProductChart = (data: Record<string, unknown>[]) => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 40, right: 20, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="product"
            tick={{ fontSize: 11, fill: "#374151", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tickFormatter={(val) => `${val.toFixed(1)}M`}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            dx={-10}
            domain={[0, "dataMax + 50"]}
          />
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            onMouseEnter={(_, i) => setHoveredBar(i)}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={hoveredBar === index ? "#dc2626" : "#ef4444"}
                className="transition-all duration-200"
              />
            ))}
            <LabelList
              dataKey="label"
              position="top"
              offset={10}
              style={{
                fill: "#dc2626",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
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
          title={section.content.actionTitle || "Product Performance Insights"}
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
              type: "bar",
              data: productData,
              title: "Top Product Performance",
              width: 800,
              height: 360,
              xKey: "product",
              yKey: "value",
              colors: ["#ef4444"],
              showGrid: false,
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

export default ProductInsightsSection;
