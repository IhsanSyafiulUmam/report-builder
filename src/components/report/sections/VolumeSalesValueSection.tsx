import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import InsightManager from "../shared/InsightManager";
import ActionTitle from "../shared/ActionTitle";
import { QueryItem } from "../QueryEditor";

interface VolumeSalesValueProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData: { Month: string; [key: string]: string }[];
      insights?: Array<{ title: string; body: string }>;
      queries?: QueryItem[];
    };
  };
  onUpdate: (updates: {
    content: {
      text?: string;
      actionTitle?: string;
      subheadline?: string;
      queries?: QueryItem[];
      insights?: Array<{ title: string; body: string }>;
    };
  }) => void;
  isEditable?: boolean;
}

function getGMVData(section: {
  content: { chartData: { Month: string; [key: string]: string }[] };
}) {
  const chartData = section?.content?.chartData;
  if (!Array.isArray(chartData)) return [];
  return chartData;
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border rounded shadow">
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between gap-4">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></span>
                <span>{entry.name}</span>
              </div>
              <span>
                {entry.value?.toFixed ? entry.value.toFixed(1) : entry.value}{" "}
                Bio
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const VolumeSalesValueSection: React.FC<VolumeSalesValueProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
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

  const GMVData = getGMVData(section);
  const keys =
    GMVData.length > 0
      ? Object.keys(GMVData[0]).filter((k) => k !== "month" && k !== "Month")
      : [];
  const insights = section.content.insights || [];
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
      channels={[]}
    >
      <div className="p-8">
        {/* Action Title */}
        <div className="mb-8 group">
          <ActionTitle
            title={
              section.content.actionTitle || "Volume Sales Value Performance"
            }
            subheadline={section.content.subheadline || ""}
            isEditable={isEditable}
            onEditTitle={handleActionTitleChange}
            onEditSubheadline={handleSubheadlineChange}
          />
        </div>


        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-5">
          <div className="p-6 bg-white shadow-sm lg:col-span-3 rounded-2xl">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={GMVData} stackOffset="expand">
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#374151", fontWeight: 600 }}
                />
                <YAxis
                  tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                  tick={{ fill: "#6b7280" }}
                />
                <Tooltip content={<CustomTooltip />} />
                {keys.map((key, idx) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={
                      [
                        "#1e3a8a",
                        "#0f766e",
                        "#15803d",
                        "#ca8a04",
                        "#991b1b",
                        "#6366f1",
                        "#f59e42",
                      ][idx % 7]
                    }
                    radius={[4, 4, 0, 0]}
                  >
                    <LabelList
                      dataKey={key}
                      position="insideTop"
                      fill="#fff"
                      fontSize={10}
                      formatter={(val: number) => `${val} Bio`}
                    />
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
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
      </div>
    </BaseSectionLayout>
  );
};

export default VolumeSalesValueSection;
