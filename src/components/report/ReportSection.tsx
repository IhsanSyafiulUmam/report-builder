import React from "react";
import OverviewSection from "./sections/OverviewSection";
import OpeningSection from "./sections/OpeningSection";
import { ExecutiveSummarySection } from "./sections/ExecutiveSummarySection";
import SalesOverviewSection from "./sections/SalesOverviewSection";
import PlatformSalesValueSection from "./sections/PlatformSalesValueSection";
import VolumeSalesValueSection from "./sections/VolumeSalesValueSection";
import StoreValueSection from "./sections/StoreSalesValueSection";
import BrandPerformancePlatformSection from "./sections/BrandPeformancePlatformSection";
import BrandPerformanceSubCategorySection from "./sections/BrandPeformanceSubCategorySection";
import TopListingPerformanceSection from "./sections/TopListingPeformanceSection";
import TopCategoriesSection from "./sections/TopCategoriesSection";
import TopResellerSection from "./sections/TopResellerSection";
import FlashSaleSection from "./sections/FlashsaleSection";
import BannerSection from "./sections/BannerSection";
import DividerSection from "./sections/DividerSection";
import TopBrandChannelSection from "./sections/TopBrandChannelSection";

interface ChartConfig {
  type: string;
  data: Array<{ name: string; value: number; value2?: number }>;
  title: string;
}

interface ReportSectionProps {
  section: {
    id: string;
    type: string;
    title: string;
    content: {
      text: string;
      chart?: ChartConfig;
      table?: object;
      chartConfig?: ChartConfig;
    };
  };
  period?: string;
  client?: string;
  onUpdate: (updates: Partial<ReportSectionProps["section"]>) => void;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  section,
  period,
  client,
  onUpdate,
}) => {
  const renderSection = () => {
    switch (section.type) {
      case "overview":
        return (
          <OverviewSection
            section={section as any}
            onUpdate={onUpdate as any}
          />
        );
      case "executive_summary":
        return (
          <ExecutiveSummarySection
            section={section as any}
            isEditable={true}
            onUpdate={onUpdate as any}
          />
        );
      case "opening":
        return (
          <OpeningSection
            section={section as any}
            onUpdate={onUpdate as any}
            client={client}
            period={period}
          />
        );
      case "sales_overview":
        return (
          <SalesOverviewSection
            section={section as any}
            isEditable={true}
            onUpdate={onUpdate as any}
          />
        );
      case "platform_sales_value":
        return (
          <PlatformSalesValueSection
            section={section as any}
            isEditable={true}
            onUpdate={onUpdate as any}
          />
        );
      case "volume_sales_value":
        return (
          <VolumeSalesValueSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "store_sales_value":
        return (
          <StoreValueSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "brand_performance_platform":
        return (
          <BrandPerformancePlatformSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "brand_performance_sub_category":
        return (
          <BrandPerformanceSubCategorySection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "top_listing_performance":
        return (
          <TopListingPerformanceSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "top_categories":
        return (
          <TopCategoriesSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "top_reseller":
        return (
          <TopResellerSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "flashsale":
        return (
          <FlashSaleSection
            section={section as any}
            onUpdate={onUpdate as any}
          />
        );
      case "banner":
        return (
          <BannerSection section={section as any} onUpdate={onUpdate as any} />
        );
      case "divider":
        return (
          <DividerSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      case "top_brand_channel":
        return (
          <TopBrandChannelSection
            section={section as any}
            onUpdate={onUpdate as any}
            isEditable={true}
          />
        );
      default:
        return (
          <div className="p-6">
            <p className="text-gray-500">
              Unknown section type: {section.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div
      data-section-id={section.id}
      className={`report-section ${section.type === "opening" ? "h-full" : ""}`}
    >
      {renderSection()}
    </div>
  );
};

export default ReportSection;
