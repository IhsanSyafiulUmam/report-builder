import React from "react";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import ActionTitle from "../shared/ActionTitle";
import TableComponent from "../TableComponent";
import { QueryItem } from "../QueryEditor";

interface TopResellerProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      queries?: QueryItem[];
      chartData: Array<{
        ShopName: string;
        Province: string;
        Channel: string;
        ShopUrl: string;
        "Total Sales": string;
        "Units Sold": string;
        "AVG Sale Price": string;
      }>;
    };
  };
  onUpdate: (updates: {
    content: {
      text?: string;
      actionTitle?: string;
      subheadline?: string;
      queries?: QueryItem[];
    };
  }) => void;
  isEditable?: boolean;
}

const TopResellerSection: React.FC<TopResellerProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const chartData = section.content.chartData || [];
  const queries = section.content.queries || [];

  const handleQueryEditorChange = (newQueries: QueryItem[]) => {
    onUpdate({ content: { ...section.content, queries: newQueries } });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: { text: e.target.value } });
  };

  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
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
            title={section.content.actionTitle || "Top Reseller Performance"}
            subheadline={section.content.subheadline || ""}
            isEditable={isEditable}
            onEditTitle={handleActionTitleChange}
            onEditSubheadline={handleSubheadlineChange}
          />
        </div>

        {isEditable ? (
          <textarea
            className="mb-10 text-base text-gray-600 max-w-8xl w-full bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical min-h-[80px]"
            value={section.content.text || ""}
            onChange={handleTextChange}
            placeholder="Enter summary or description..."
          />
        ) : (
          <p className="mb-10 text-base text-gray-600 whitespace-pre-line max-w-8xl">
            {section.content.text}
          </p>
        )}

        <TableComponent
          config={{
            type: "reseller",
            data: chartData,
            title: "Top Reseller Performance",
            columns: [
              { key: "ShopName", label: "Shop Name", type: "text" },
              { key: "Province", label: "Province", type: "text" },
              { key: "Channel", label: "Channel", type: "text" },
              { key: "ShopUrl", label: "Shop URL", type: "link" },
              { key: "Total Sales", label: "Total Sales", type: "currency" },
              { key: "Units Sold", label: "Units Sold", type: "number" },
              {
                key: "AVG Sale Price",
                label: "Avg Sale Price",
                type: "currency",
              },
            ],
            showHeader: true,
            striped: true,
            compact: false,
          }}
          isEditable={false}
        />
      </div>
    </BaseSectionLayout>
  );
};

export default TopResellerSection;
