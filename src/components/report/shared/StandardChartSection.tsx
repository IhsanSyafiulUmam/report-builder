import React from "react";
import { BaseSectionLayout, InsightManager } from "./index";
import { QueryItem } from "../QueryEditor";

interface StandardChartSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      insights?: Array<{ title: string; body: string }>;
      queries?: QueryItem[];
      chartData?: Record<string, unknown>;
    };
  };
  onUpdate: (updates: {
    content: {
      text: string;
      insights?: Array<{ title: string; body: string }>;
      queries?: QueryItem[];
      chartData?: Record<string, unknown>;
    };
  }) => void;
  isEditable?: boolean;
  chartComponent: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  channels?: string[];
  period?: string;
}

const StandardChartSection: React.FC<StandardChartSectionProps> = ({
  section,
  onUpdate,
  isEditable = false,
  chartComponent,
  headerTitle,
  headerSubtitle,
  channels = [],
  period = "Apr - Jun 2025",
}) => {
  const queries = section.content.queries || [];
  const insights = section.content.insights || [];

  const handleQueryEditorChange = (newQueries: QueryItem[]) => {
    onUpdate({ content: { ...section.content, queries: newQueries } });
  };

  const handleAddInsight = () => {
    const newInsights = [...insights, { title: "", body: "" }];
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

  return (
    <BaseSectionLayout
      queries={queries}
      isEditable={isEditable}
      onQueryChange={handleQueryEditorChange}
      channels={channels}
      period={period}
    >
      <div className="min-h-[400px] bg-gray-50">
        <div className="px-6 py-10 lg:px-12">
          {(headerTitle || headerSubtitle) && (
            <div className="mb-6">
              {headerTitle && (
                <h2 className="text-2xl font-semibold text-gray-800">
                  {headerTitle}
                </h2>
              )}
              {headerSubtitle && (
                <p className="mt-1 text-gray-600">{headerSubtitle}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5">
            {/* Chart Section */}
            <div className="p-6 bg-white shadow-sm lg:col-span-3 rounded-2xl">
              {chartComponent}
            </div>

            {/* Insights Section */}
            <InsightManager
              insights={insights}
              isEditable={isEditable}
              onAddInsight={handleAddInsight}
              onEditInsight={handleEditInsight}
              onDeleteInsight={handleDeleteInsight}
            />
          </div>
        </div>
      </div>
    </BaseSectionLayout>
  );
};

export default StandardChartSection;
