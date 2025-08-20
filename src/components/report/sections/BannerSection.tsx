import React from "react";
import { ShoppingCart } from "lucide-react";

interface BannerSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
    };
  };
  onUpdate: (updates: { content: { text: string } }) => void;
}

const dashboardData = {
  bannerPerformance: [
    { bannerType: "Home Banner", shopee: 150, tokopedia: 120, lazada: 80, tiktok: 60, blibli: 45, bukalapak: 30 },
    { bannerType: "Category Banner", shopee: 95, tokopedia: 85, lazada: 70, tiktok: 40, blibli: 35, bukalapak: 25 },
    { bannerType: "Product Banner", shopee: 200, tokopedia: 180, lazada: 120, tiktok: 90, blibli: 75, bukalapak: 50 },
    { bannerType: "Promo Banner", shopee: 130, tokopedia: 110, lazada: 85, tiktok: 65, blibli: 50, bukalapak: 35 },
    { bannerType: "Flash Sale Banner", shopee: 175, tokopedia: 160, lazada: 110, tiktok: 80, blibli: 60, bukalapak: 40 }
  ],
  bannerSummaries: {
    shopee: {
      totalUnitSold: 45250,
      totalSlot: 1200,
      totalSalesValue: '280.5 Bio',
      averageSalesPrice: '6.2 Juta'
    },
    tokopedia: {
      totalUnitSold: 38900,
      totalSlot: 980,
      totalSalesValue: '195.7 Bio',
      averageSalesPrice: '5.0 Juta'
    },
    lazada: {
      totalUnitSold: 29500,
      totalSlot: 850,
      totalSalesValue: '152.3 Bio',
      averageSalesPrice: '5.2 Juta'
    },
    tiktok: {
      totalUnitSold: 22100,
      totalSlot: 650,
      totalSalesValue: '98.4 Bio',
      averageSalesPrice: '4.5 Juta'
    },
    blibli: {
      totalUnitSold: 18750,
      totalSlot: 520,
      totalSalesValue: '89.2 Bio',
      averageSalesPrice: '4.8 Juta'
    },
    bukalapak: {
      totalUnitSold: 12800,
      totalSlot: 380,
      totalSalesValue: '65.1 Bio',
      averageSalesPrice: '5.1 Juta'
    }
  }
};

const bannerPlatformNames = ['Shopee', 'Tokopedia', 'Lazada', 'TikTok', 'Blibli', 'Bukalapak'];
const bannerPlatformKeys = ['shopee', 'tokopedia', 'lazada', 'tiktok', 'blibli', 'bukalapak'];

const bannerSummaryRows = [
  { label: 'Total Unit Sold', key: 'totalUnitSold' as const },
  { label: 'Total Slot', key: 'totalSlot' as const },
  { label: 'Total Sales Value', key: 'totalSalesValue' as const },
  { label: 'Average Sales Price', key: 'averageSalesPrice' as const }
];

interface BannerData {
  bannerType: string;
  shopee: number | null;
  tokopedia: number | null;
  lazada: number | null;
  tiktok: number | null;
  blibli: number | null;
  bukalapak: number | null;
}

// Banner Table Component
const BannerTable: React.FC = () => {
  const getCellValue = (bannerData: BannerData, platform: string): number | null => {
    return bannerData[platform as keyof BannerData] as number || null;
  };

  const getCellClassName = (value: number | null): string => {
    if (!value) return 'bg-gray-50';
    
    if (value >= 100) return 'bg-green-200 text-gray-800';
    if (value >= 50) return 'bg-green-100 text-gray-800';
    if (value >= 20) return 'bg-green-50 text-gray-800';
    
    return 'bg-white';
  };

  return (
    <div className="overflow-hidden bg-white shadow-lg rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-red-800">
              <th className="px-4 py-4 text-sm font-semibold text-left text-white border-r border-red-700">
                Banner Type
              </th>
              {bannerPlatformNames.map((platform) => (
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
            {dashboardData.bannerPerformance.map((bannerData, index) => (
              <tr
                key={bannerData.bannerType}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                  {bannerData.bannerType}
                </td>
                {bannerPlatformKeys.map((platformKey) => {
                  const value = getCellValue(bannerData, platformKey);
                  return (
                    <td
                      key={platformKey}
                      className={`px-4 py-3 text-center text-sm font-medium border-r border-gray-200 last:border-r-0 transition-all duration-200 hover:scale-105 ${getCellClassName(value)}`}
                    >
                      {value || ''}
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

// Banner Summary Table Component
const BannerSummaryTable: React.FC = () => {
  const formatNumber = (value: number | string): string => {
    if (typeof value === 'string') return value;
    return value.toLocaleString();
  };

  return (
    <div className="mt-8 overflow-hidden bg-white shadow-lg rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-red-800">
              <th className="px-4 py-4 text-sm font-semibold text-left text-white border-r border-red-700">
                Summary Metrics
              </th>
              {bannerPlatformNames.map((platform) => (
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
            {bannerSummaryRows.map((row, index) => (
              <tr
                key={row.key}
                className={`hover:bg-gray-50 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
              >
                <td className="px-4 py-3 text-sm font-semibold text-gray-800 border-r border-gray-200 bg-gray-50">
                  {row.label}
                </td>
                {bannerPlatformKeys.map((platformKey) => {
                  const value = dashboardData.bannerSummaries[platformKey][row.key];
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

// Main Banner Section
const BannerSection: React.FC<BannerSectionProps> = ({ section, onUpdate }) => {
  return (
    <div className="min-h-[500px] bg-gray-50 flex-1 flex flex-col">
      <div className="flex-1 px-6 py-10 lg:px-12">
        <p className="mb-10 text-base text-gray-600 max-w-8xl">
          Banner performance analysis across major e-commerce platforms by banner type. Product banners show the highest engagement with Shopee leading at 200 clicks, followed by Tokopedia at 180 clicks.
        </p>

        {/* Banner Table */}
        <BannerTable />

        {/* Banner Summary Table */}
        <BannerSummaryTable />

        <div className="flex items-center justify-between pt-6 text-sm text-gray-500 border-t mt-14">
          <div>
            <p>
              <span className="font-medium">Sumber:</span> Markethac Data
            </p>
            <p>
              <span className="font-medium">Periode:</span> Sep 2024 - Feb 2025
            </p>
            <p>
              <span className="font-medium">Channel:</span> Shopee, Tokopedia, Lazada, TikTok, Blibli, Bukalapak
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-700">
              markethac
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;