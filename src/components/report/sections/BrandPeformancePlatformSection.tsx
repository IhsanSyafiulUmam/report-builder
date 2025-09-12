import React from "react";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import ActionTitle from "../shared/ActionTitle";
import { QueryItem } from "../QueryEditor";

interface BrandPlatformData {
  Platform: string;
  "Brand GMV (Bio)": string;
  "Brand Share (%)": string;
  "QoQ Growth": string;
  "Market Growth": string;
  "Performance Signal": string;
}

interface BrandPerformancePlatformProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData?: BrandPlatformData[];
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

const BrandPerformancePlatformSection: React.FC<
  BrandPerformancePlatformProps
> = ({ section, onUpdate, isEditable = false }) => {
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
        <div className="mb-8 group">
          <ActionTitle
            title={section.content.actionTitle || "Platform Sales Performance"}
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
            <thead className="text-xs text-gray-600 uppercase bg-gray-100 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3">
                  Brand GMV (Bio)
                </th>
                <th scope="col" className="px-6 py-3">
                  Brand Share (%)
                </th>
                <th scope="col" className="px-6 py-3">
                  QoQ Growth
                </th>
                <th scope="col" className="px-6 py-3">
                  Market Growth
                </th>
                <th scope="col" className="px-6 py-3">
                  Performance Signal
                </th>
              </tr>
            </thead>
            <tbody>
              {(section.content.chartData || []).map((item, idx) => (
                <tr
                  key={item.Platform || idx}
                  className="transition border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {item.Platform}
                  </td>
                  <td className="px-6 py-4">{item["Brand GMV (Bio)"]}</td>
                  <td className="px-6 py-4">{item["Brand Share (%)"]}</td>
                  <td className="px-6 py-4">{item["QoQ Growth"]}</td>
                  <td className="px-6 py-4">{item["Market Growth"]}</td>
                  <td className="px-6 py-4">{item["Performance Signal"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </BaseSectionLayout>
  );
};

export default BrandPerformancePlatformSection;
