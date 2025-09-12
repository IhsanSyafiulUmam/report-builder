import React from "react";
import BaseSectionLayout from "../shared/BaseSectionLayout";
import ActionTitle from "../shared/ActionTitle";

interface FlashSaleProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
    };
  };
  onUpdate: (updates: {
    content: {
      text?: string;
      actionTitle?: string;
      subheadline?: string;
    };
  }) => void;
  isEditable?: boolean;
}

const dashboardData = {
  salesByTime: [
    {
      time: "00:00:00",
      akulaku: 5,
      blibli: 50,
      lazada: 21,
      shopee: 17,
      tiktok: null,
      tokopedia: 4,
    },
    {
      time: "06:00:00",
      akulaku: null,
      blibli: null,
      lazada: null,
      shopee: null,
      tiktok: null,
      tokopedia: 5,
    },
    {
      time: "10:00:00",
      akulaku: null,
      blibli: null,
      lazada: null,
      shopee: null,
      tiktok: null,
      tokopedia: 3,
    },
    {
      time: "12:00:00",
      akulaku: null,
      blibli: null,
      lazada: 32,
      shopee: 14,
      tiktok: 13,
      tokopedia: null,
    },
    {
      time: "14:00:00",
      akulaku: null,
      blibli: null,
      lazada: null,
      shopee: null,
      tiktok: null,
      tokopedia: 4,
    },
    {
      time: "18:00:00",
      akulaku: null,
      blibli: null,
      lazada: null,
      shopee: 13,
      tiktok: null,
      tokopedia: null,
    },
    {
      time: "20:00:00",
      akulaku: null,
      blibli: null,
      lazada: null,
      shopee: 17,
      tiktok: 17,
      tokopedia: null,
    },
  ],
  platformSummaries: {
    akulaku: {
      totalUnitsSold: 4540,
      totalSlot: 938,
      avgUnitsPerSlot: 5,
      totalSalesValue: "8.9 Bio",
    },
    blibli: {
      totalUnitsSold: 15893,
      totalSlot: 316,
      avgUnitsPerSlot: 50,
      totalSalesValue: "36.7 Bio",
    },
    lazada: {
      totalUnitsSold: 18536,
      totalSlot: 858,
      avgUnitsPerSlot: 22,
      totalSalesValue: "32.3 Bio",
    },
    shopee: {
      totalUnitsSold: 69691,
      totalSlot: 4726,
      avgUnitsPerSlot: 15,
      totalSalesValue: "155.4 Bio",
    },
    tiktok: {
      totalUnitsSold: 988,
      totalSlot: 63,
      avgUnitsPerSlot: 16,
      totalSalesValue: "1.6 Bio",
    },
    tokopedia: {
      totalUnitsSold: 447,
      totalSlot: 117,
      avgUnitsPerSlot: 4,
      totalSalesValue: "0.9 Bio",
    },
  },
};

const platformNames = [
  "Akulaku",
  "Blibli",
  "Lazada",
  "Shopee",
  "Tiktok",
  "Tokopedia",
];
const platformKeys = [
  "akulaku",
  "blibli",
  "lazada",
  "shopee",
  "tiktok",
  "tokopedia",
];

const summaryRows = [
  { label: "Total Unit Sold", key: "totalUnitsSold" as const },
  { label: "Total Slot", key: "totalSlot" as const },
  { label: "Avg. Units Sold per Slot", key: "avgUnitsPerSlot" as const },
  { label: "Total Sales Value", key: "totalSalesValue" as const },
];

interface SalesData {
  time: string;
  akulaku: number | null;
  blibli: number | null;
  lazada: number | null;
  shopee: number | null;
  tiktok: number | null;
  tokopedia: number | null;
}

// Sales Table Component
const SalesTable: React.FC = () => {
  const getCellValue = (
    salesData: SalesData,
    platform: string
  ): number | null => {
    return (salesData[platform as keyof SalesData] as number) || null;
  };

  const getCellClassName = (value: number | null): string => {
    if (!value) return "bg-gray-50";

    if (value >= 30) return "bg-green-200 text-gray-800";
    if (value >= 15) return "bg-green-100 text-gray-800";
    if (value >= 5) return "bg-green-50 text-gray-800";

    return "bg-white";
  };

  return (
    <div className="overflow-hidden bg-white shadow-lg rounded-xl">
      <div
        className="overflow-auto"
        style={{ maxHeight: "400px", minHeight: "200px" }}
      >
        <table className="w-full">
          <thead>
            <tr className="bg-red-800">
              <th className="px-4 py-4 text-sm font-semibold text-left text-white border-r border-red-700">
                Flash Sale Start
              </th>
              {platformNames.map((platform) => (
                <th
                  key={platform}
                  className="px-4 py-4 text-sm font-semibold text-center text-white border-r border-red-700 last:border-r-0"
                >
                  {platform}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dashboardData.salesByTime.map((timeData, index) => (
              <tr
                key={timeData.time}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                  {timeData.time}
                </td>
                {platformKeys.map((platformKey) => {
                  const value = getCellValue(timeData, platformKey);
                  return (
                    <td
                      key={platformKey}
                      className={`px-4 py-3 text-center text-sm font-medium border-r border-gray-200 last:border-r-0 transition-all duration-200 hover:scale-105 ${getCellClassName(
                        value
                      )}`}
                    >
                      {value || ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Summary Table Component
const SummaryTable: React.FC = () => {
  const formatNumber = (value: number | string): string => {
    if (typeof value === "string") return value;
    return value.toLocaleString();
  };

  return (
    <div className="mt-8 overflow-hidden bg-white shadow-lg rounded-xl">
      <div
        className="overflow-auto"
        style={{ maxHeight: "400px", minHeight: "200px" }}
      >
        <table className="w-full">
          <thead>
            <tr className="bg-red-800">
              <th className="px-4 py-4 text-sm font-semibold text-left text-white border-r border-red-700">
                Summary Metrics
              </th>
              {platformNames.map((platform) => (
                <th
                  key={platform}
                  className="px-4 py-4 text-sm font-semibold text-center text-white border-r border-red-700 last:border-r-0"
                >
                  {platform}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {summaryRows.map((row, index) => (
              <tr
                key={row.key}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-25"
                }`}
              >
                <td className="px-4 py-3 text-sm font-semibold text-gray-800 border-r border-gray-200 bg-gray-50">
                  {row.label}
                </td>
                {platformKeys.map((platformKey) => {
                  const value =
                    dashboardData.platformSummaries[platformKey][row.key];
                  return (
                    <td
                      key={platformKey}
                      className="px-4 py-3 text-sm font-bold text-center text-gray-900 transition-colors duration-200 border-r border-gray-200 last:border-r-0 hover:bg-blue-50"
                    >
                      {formatNumber(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const FlashSaleSection: React.FC<FlashSaleProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ content: { text: e.target.value } });
  };

  return (
    <BaseSectionLayout
      queries={[]}
      isEditable={isEditable}
      onQueryChange={() => {}}
      channels={[
        "Akulaku",
        "Blibli",
        "Lazada",
        "Shopee",
        "TikTok",
        "Tokopedia",
      ]}
    >
      <div className="p-8">
        {/* Action Title */}
        <div className="mb-8 group">
          <ActionTitle
            title={section.content.actionTitle || "Flash Sale Performance"}
            subheadline={
              section.content.subheadline ||
              "Flash sale performance across major e-commerce platforms during peak hours"
            }
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

        {/* Sales Table */}
        <SalesTable />

        {/* Summary Table */}
        <SummaryTable />
      </div>
    </BaseSectionLayout>
  );
};

export default FlashSaleSection;
