import React from "react";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import ActionTitle from "../shared/ActionTitle";
import { QueryItem } from "../QueryEditor";

interface BrandChannelData {
  Channel: string;
  Brand: string;
  "GMV (Bio)": string;
  "Monthly Growth (%)": string;
}

interface TopBrandChannelProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData?: BrandChannelData[];
      queries?: QueryItem[];
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

const BRAND_NAME_MAX = 60;
const trimBrandName = (s: string) =>
  s.length > BRAND_NAME_MAX ? s.slice(0, BRAND_NAME_MAX - 1) + "…" : s;

const TopBrandChannelSection: React.FC<TopBrandChannelProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
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
    >
      <div className="p-8">
        <div className="mb-8 group">
          <ActionTitle
            title={
              section.content.actionTitle || "Top Brand by Channel Performance"
            }
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

        <div
          className="overflow-auto border border-gray-200 rounded-lg"
          style={{ maxHeight: "400px", minHeight: "200px" }}
        >
          <table className="min-w-full text-sm text-left text-gray-700 bg-white">
            <thead className="sticky top-0 text-xs text-gray-600 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Channel</th>
                <th className="px-6 py-3">Brand</th>
                <th className="px-6 py-3">GMV (Bio)</th>
                <th className="px-6 py-3">Monthly Growth (%)</th>
              </tr>
            </thead>
            <tbody>
              {(section.content.chartData || []).map((item, idx) => {
                const keyBase =
                  item["Channel"] && item["Brand"]
                    ? `${item["Channel"]}-${item["Brand"]}`
                    : item["Brand"] || String(idx);

                const brandName = item["Brand"];

                return (
                  <tr
                    key={keyBase}
                    className="transition border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item["Channel"]}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        title={brandName}
                        className="inline-block max-w-[400px] truncate align-middle"
                      >
                        {trimBrandName(brandName)}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item["GMV (Bio)"]}</td>
                    <td className="px-6 py-4">{item["Monthly Growth (%)"]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </BaseSectionLayout>
  );
};

export default TopBrandChannelSection;
