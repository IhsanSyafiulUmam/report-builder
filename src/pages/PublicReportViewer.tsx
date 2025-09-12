import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Loader2,
  ArrowLeft,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { supabase } from "../supabaseClient";
import { Report } from "../contexts/ReportContext";
import DownloadButton from "../components/report/DownloadButton";
import OverviewSection from "../components/report/sections/OverviewSection";
import OpeningSection from "../components/report/sections/OpeningSection";
import SalesOverviewSection from "../components/report/sections/SalesOverviewSection";
import PlatformSalesValueSection from "../components/report/sections/PlatformSalesValueSection";
import VolumeSalesValueSection from "../components/report/sections/VolumeSalesValueSection";
import StoreValueSection from "../components/report/sections/StoreSalesValueSection";
import BrandPerformancePlatformSection from "../components/report/sections/BrandPeformancePlatformSection";
import BrandPerformanceSubCategorySection from "../components/report/sections/BrandPeformanceSubCategorySection";
import TopListingPerformanceSection from "../components/report/sections/TopListingPeformanceSection";
import TopCategoriesSection from "../components/report/sections/TopCategoriesSection";
import TopResellerSection from "../components/report/sections/TopResellerSection";
import FlashSaleSection from "../components/report/sections/FlashsaleSection";
import BannerSection from "../components/report/sections/BannerSection";
import DividerSection from "../components/report/sections/DividerSection";
import TopBrandChannelSection from "../components/report/sections/TopBrandChannelSection";
import { ExecutiveSummarySection } from "../components/report/sections/ExecutiveSummarySection";
import CustomerPerformanceSection from "../components/report/sections/CustomerPerformanceSection";
import ProductInsightsSection from "../components/report/sections/ProductInsightsSection";
import SeasonalPatternsSection from "../components/report/sections/SeasonalPatternsSection";
import GeographicIntelligenceSection from "../components/report/sections/GeographicIntelligenceSection";

const PublicReportViewer = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [clientName, setClientName] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("public_token", token)
        .single();
      if (error || !data) {
        setReport(null);
      } else {
        setReport(data);
      }
      setLoading(false);
    };
    if (token) fetchReport();
  }, [token]);

  useEffect(() => {
    const fetchClientName = async () => {
      if (report?.client_id) {
        const { data, error } = await supabase
          .from("clients")
          .select("name")
          .eq("id", report.client_id)
          .single();
        if (!error && data) setClientName(data.name);
      }
    };
    if (report) fetchClientName();
  }, [report]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Report Not Found
          </h2>
          <p className="mb-4 text-gray-600">
            The requested public report could not be found.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentPageData = report.sections[currentPage];

  const renderPageContent = () => {
    switch (currentPageData.type) {
      case "overview":
        return (
          <OverviewSection section={currentPageData} onUpdate={() => {}} />
        );
      case "sales_overview":
        return (
          <SalesOverviewSection
            section={currentPageData}
            isEditable={false}
            onUpdate={() => {}}
          />
        );
      case "platform_sales_value":
        return (
          <PlatformSalesValueSection
            section={currentPageData}
            isEditable={false}
            onUpdate={() => {}}
          />
        );
      case "volume_sales_value":
        return (
          <VolumeSalesValueSection
            section={currentPageData}
            onUpdate={() => {}}
          />
        );
      case "store_sales_value":
        return (
          <StoreValueSection section={currentPageData} onUpdate={() => {}} />
        );
      case "brand_performance_platform":
        return (
          <BrandPerformancePlatformSection
            section={currentPageData}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "brand_performance_sub_category":
        return (
          <BrandPerformanceSubCategorySection
            section={currentPageData}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "top_listing_performance":
        return (
          <TopListingPerformanceSection
            section={currentPageData}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "top_categories":
        return (
          <TopCategoriesSection
            section={currentPageData as Report["sections"][number]}
            onUpdate={() => {}}
          />
        );
      case "top_reseller":
        return (
          <TopResellerSection
            section={currentPageData}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "flashsale":
        return (
          <FlashSaleSection section={currentPageData} onUpdate={() => {}} />
        );
      case "banner":
        return <BannerSection section={currentPageData} onUpdate={() => {}} />;
      case "divider":
        return (
          <DividerSection
            section={currentPageData}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "opening":
        return (
          <div
            className="relative w-full mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
            style={{ aspectRatio: "16/9", minHeight: "400px" }}
          >
            <OpeningSection
              section={currentPageData}
              onUpdate={() => {}}
              period={report.period}
              client={clientName}
            />
          </div>
        );
      case "customer_performance":
        return (
          <CustomerPerformanceSection
            section={currentPageData as any}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "product_insights":
        return (
          <ProductInsightsSection
            section={currentPageData as any}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "seasonal_patterns":
        return (
          <SeasonalPatternsSection
            section={currentPageData as any}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      case "geographic_intelligence":
        return (
          <GeographicIntelligenceSection
            section={currentPageData as any}
            onUpdate={() => {}}
            isEditable={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {report.title}
              </h2>
              <p className="text-sm text-gray-500">
                {clientName || "Loading client..."}
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-400 lg:hidden hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          {/* Page Navigation */}
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {report.sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentPage(index);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                    currentPage === index
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        currentPage === index
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium truncate">
                      {section.title}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center p-4 border-t border-gray-200">
            <DownloadButton
              reportTitle={report.title || "Report"}
              variant="dropdown"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 lg:hidden hover:text-gray-600"
              >
                <Menu size={20} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    navigate("/");
                  }
                }}
                className="flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Page {currentPage + 1} of {report.sections.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(report.sections.length - 1, p + 1)
                    )
                  }
                  disabled={currentPage === report.sections.length - 1}
                  className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 mx-auto max-w-8xl">
            <div className="p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {currentPageData.title}
                </h1>
                <div className="w-16 h-1 bg-blue-600 rounded"></div>
              </div>
              {renderPageContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Hidden content for PDF generation */}
      <div
        id="report-viewer-pdf-all"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          minHeight: "100vh",
          opacity: 1,
          pointerEvents: "none",
          zIndex: -1,
        }}
        aria-hidden="true"
      >
        <div className="p-8 mx-auto max-w-8xl">
          {report.sections.map((section) => (
            <div key={section.id} data-section-id={section.id} className="mb-8">
              {/* Render section content directly without extra wrapper */}
              {(() => {
                switch (section.type) {
                  case "overview":
                    return (
                      <OverviewSection section={section} onUpdate={() => {}} />
                    );
                  case "sales_overview":
                    return (
                      <SalesOverviewSection
                        section={section as any}
                        isEditable={false}
                        onUpdate={() => {}}
                      />
                    );
                  case "platform_sales_value":
                    return (
                      <PlatformSalesValueSection
                        section={section as any}
                        isEditable={false}
                        onUpdate={() => {}}
                      />
                    );
                  case "volume_sales_value":
                    return (
                      <VolumeSalesValueSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "store_sales_value":
                    return (
                      <StoreValueSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "brand_performance_platform":
                    return (
                      <BrandPerformancePlatformSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "brand_performance_sub_category":
                    return (
                      <BrandPerformanceSubCategorySection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "top_listing_performance":
                    return (
                      <TopListingPerformanceSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "top_categories":
                    return (
                      <TopCategoriesSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "top_reseller":
                    return (
                      <TopResellerSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "flashsale":
                    return (
                      <FlashSaleSection
                        section={section as any}
                        onUpdate={() => {}}
                      />
                    );
                  case "banner":
                    return (
                      <BannerSection
                        section={section as any}
                        onUpdate={() => {}}
                      />
                    );
                  case "divider":
                    return (
                      <DividerSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "opening":
                    return (
                      <div
                        className="relative w-full mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
                        style={{ aspectRatio: "16/9", minHeight: "400px" }}
                      >
                        <OpeningSection
                          section={section as any}
                          onUpdate={() => {}}
                          period={report.period}
                          client={clientName}
                        />
                      </div>
                    );
                  case "customer_performance":
                    return (
                      <CustomerPerformanceSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "product_insights":
                    return (
                      <ProductInsightsSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "seasonal_patterns":
                    return (
                      <SeasonalPatternsSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "geographic_intelligence":
                    return (
                      <GeographicIntelligenceSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  case "executive_summary":
                    return (
                      <ExecutiveSummarySection
                        section={section as any}
                        isEditable={false}
                        onUpdate={() => {}}
                      />
                    );
                  case "top_brand_channel":
                    return (
                      <TopBrandChannelSection
                        section={section as any}
                        onUpdate={() => {}}
                        isEditable={false}
                      />
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default PublicReportViewer;
