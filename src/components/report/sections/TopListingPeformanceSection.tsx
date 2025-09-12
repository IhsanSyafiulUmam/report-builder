import React from "react";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import ActionTitle from "../shared/ActionTitle";
import { QueryItem } from "../QueryEditor";

interface ListingData {
  Platform: string;
  "Listing Name": string;
  ListingLink?: string;
  "GMV (Bio)": string;
  "% of Brand GMV": string;
  "QoQ Growth": string;
}

interface TopListingPerformanceProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
      chartData?: ListingData[];
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

const NAME_MAX = 80;
const trimName = (s: string) => (s.length > NAME_MAX ? s.slice(0, NAME_MAX - 1) + "…" : s);

const TopListingPerformanceSection: React.FC<TopListingPerformanceProps> = ({
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
      channels={[]}
    >
      <div className="p-8">
        <div className="mb-8 group">
          <ActionTitle
            title={section.content.actionTitle || "Top Listing Performance"}
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

        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden text-sm text-left text-gray-700 bg-white border shadow-sm rounded-2xl">
            <thead className="text-xs text-gray-600 uppercase bg-gray-100">
              <tr>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">Listing Name</th>
                <th className="px-6 py-3">GMV (Bio)</th>
                <th className="px-6 py-3">% of Brand GMV</th>
                <th className="px-6 py-3">QoQ Growth</th>
              </tr>
            </thead>
            <tbody>
              {(section.content.chartData || []).map((item, idx) => {
                const keyBase =
                  (item["Platform"] && item["Listing Name"])
                    ? `${item["Platform"]}-${item["Listing Name"]}`
                    : item["Listing Name"] || String(idx);

                const link = (item as any).ListingLink as string | undefined;
                const name = item["Listing Name"];

                return (
                  <tr
                    key={keyBase}
                    className="transition border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item["Platform"]}
                    </td>
                    <td className="px-6 py-4">
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={name}
                          className="text-red-700 hover:underline inline-block max-w-[560px] truncate align-middle"
                        >
                          {trimName(name)}
                        </a>
                      ) : (
                        <span
                          title={name}
                          className="inline-block max-w-[560px] truncate align-middle"
                        >
                          {trimName(name)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">{item["GMV (Bio)"]}</td>
                    <td className="px-6 py-4">{item["% of Brand GMV"]}</td>
                    <td className="px-6 py-4">{item["QoQ Growth"]}</td>
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

export default TopListingPerformanceSection;
