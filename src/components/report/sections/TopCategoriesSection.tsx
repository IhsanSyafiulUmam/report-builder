import React from "react";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import { InsightManager, ActionTitle } from "../shared";
import TableComponent from "../TableComponent";
import { QueryItem } from "../QueryEditor";

interface CategoryData {
  category: string;
  gmv: number;
  rankChange: number | "unchanged";
  growth: number;
  analysis: string;
}

interface ChartData {
  categories: CategoryData[];
  insights?: Array<{ title: string; body: string }>;
}

interface TopCategoriesSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData: Record<string, ChartData>;
      queries?: QueryItem[];
    };
  };
  onUpdate: (updates: {
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData: Record<string, ChartData>;
      queries?: QueryItem[];
    };
  }) => void;
  isEditable: boolean;
}

const TopCategoriesSection: React.FC<TopCategoriesSectionProps> = ({
  section,
  onUpdate,
  isEditable,
}) => {
  const queries = section.content.queries || [];
  const topCategories = section.content.chartData || {};
  const channelNames = Object.keys(topCategories);

  const handleQueryEditorChange = (newQueries: QueryItem[]) => {
    onUpdate({ content: { ...section.content, queries: newQueries } });
  };

  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
  };

  const handleAddInsight = (channel: string) => {
    const updatedChartData = { ...topCategories };
    updatedChartData[channel] = updatedChartData[channel] || {
      insights: [],
      categories: [],
    };
    if (!updatedChartData[channel].insights) {
      updatedChartData[channel].insights = [];
    }
    updatedChartData[channel].insights!.push({ title: "", body: "" });
    onUpdate({ content: { ...section.content, chartData: updatedChartData } });
  };

  const handleEditInsight = (
    channel: string,
    index: number,
    field: "title" | "body",
    value: string
  ) => {
    const updatedChartData = { ...topCategories };
    updatedChartData[channel] = updatedChartData[channel] || {
      insights: [],
      categories: [],
    };
    if (!updatedChartData[channel].insights) {
      updatedChartData[channel].insights = [];
    }
    updatedChartData[channel].insights![index] = {
      ...updatedChartData[channel].insights![index],
      [field]: value,
    };
    onUpdate({ content: { ...section.content, chartData: updatedChartData } });
  };

  const handleDeleteInsight = (channel: string, index: number) => {
    const updatedChartData = { ...topCategories };
    if (updatedChartData[channel] && updatedChartData[channel].insights) {
      updatedChartData[channel].insights = updatedChartData[
        channel
      ].insights!.filter((_, i) => i !== index);
    }
    onUpdate({ content: { ...section.content, chartData: updatedChartData } });
  };

  // Helper function to format categories data for TableComponent
  const formatCategoriesData = (categories: CategoryData[]) => {
    return categories.map((item) => ({
      category: item.category,
      gmv: `${item.gmv} Bio`,
      gmvValue: item.gmv, // for bar chart
      rankChange: item.rankChange,
      growth: `${item.growth.toFixed(2)}%`,
    }));
  };

  // Custom formatter for GMV column with bar chart
  const formatGMVWithBar = (value: string, row: any, maxGMV: number) => {
    const gmvValue = row.gmvValue || 0;
    const percentage = (gmvValue / maxGMV) * 100;

    return (
      <div className="flex items-center">
        <div
          className="h-4 rounded-sm bg-red-600"
          style={{ width: `${percentage}%`, minWidth: "20px" }}
        />
        <span className="ml-2 text-sm font-normal text-red-600">{value}</span>
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
      <div className="flex flex-col gap-8 p-8">
        {/* Action Title */}
        <div className="group">
          <ActionTitle
            title={section.content.actionTitle || "Top Categories Analysis"}
            subheadline={section.content.subheadline}
            isEditable={isEditable}
            onEditTitle={handleActionTitleChange}
            onEditSubheadline={handleSubheadlineChange}
            className="mb-6"
          />
        </div>

        {/* Channels Data */}
        {channelNames.map((channel) => {
          const channelData = topCategories[channel];
          const categoryData = channelData?.categories || [];
          const insights = channelData?.insights || [];
          return (
            <div key={channel}>
              <h3 className="mb-4 text-lg font-bold text-gray-800 capitalize">
                {channel}
              </h3>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Table Section */}
                <div className="md:col-span-2">
                  <TableComponent
                    config={{
                      type: "categories",
                      data: formatCategoriesData(categoryData),
                      title: `${channel} Categories Performance`,
                      columns: [
                        { key: "category", label: "Category", type: "text" },
                        {
                          key: "gmv",
                          label: "GMV",
                          type: "text",
                          formatter: (value, row) =>
                            formatGMVWithBar(
                              value as string,
                              row,
                              Math.max(...categoryData.map((d) => d.gmv), 1)
                            ),
                        },
                        { key: "rankChange", label: "Rank", type: "text" },
                        { key: "growth", label: "Growth", type: "text" },
                      ],
                      showHeader: true,
                      striped: false,
                      compact: true,
                    }}
                    isEditable={false}
                  />
                </div>
                {/* Insights Section */}
                <div className="space-y-4">
                  <InsightManager
                    insights={insights}
                    isEditable={isEditable}
                    onAddInsight={() => handleAddInsight(channel)}
                    onEditInsight={(index, field, value) =>
                      handleEditInsight(channel, index, field, value)
                    }
                    onDeleteInsight={(index) =>
                      handleDeleteInsight(channel, index)
                    }
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BaseSectionLayout>
  );
};

export default TopCategoriesSection;
