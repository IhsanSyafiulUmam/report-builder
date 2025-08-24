import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Loader2,
  Check,
} from "lucide-react";
import DownloadButton from "../components/report/DownloadButton";

function generateToken(length = 32) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
import { supabase } from "../supabaseClient";
import { useReports, Report, ReportSection } from "../contexts/ReportContext";
import OverviewSection from "../components/report/sections/OverviewSection";
import OpeningSection from "../components/report/sections/OpeningSection";
import { ExecutiveSummarySection } from "../components/report/sections/ExecutiveSummarySection";
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
import CustomerPerformanceSection from "../components/report/sections/CustomerPerformanceSection";
import ProductInsightsSection from "../components/report/sections/ProductInsightsSection";
import SeasonalPatternsSection from "../components/report/sections/SeasonalPatternsSection";
import GeographicIntelligenceSection from "../components/report/sections/GeographicIntelligenceSection";

const ReportViewer = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  // Handle share button click
  const handleShare = async () => {
    if (!report) return;
    setShareLoading(true);
    let token = report.public_token;
    // If no token, generate and update in Supabase
    if (!token) {
      token = generateToken(32);
      const { error } = await supabase
        .from("reports")
        .update({ public_token: token })
        .eq("id", report.id);
      if (!error) {
        setReport({ ...report, public_token: token });
      }
    }
    // Build public URL
    const url = `${window.location.origin}/public/report/${token}`;
    setShareUrl(url);
    setShareModalOpen(true);
    setShareLoading(false);
    setCopySuccess(false);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    }
  };
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { getReport, loading } = useReports();
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [clientName, setClientName] = useState("");

  // Dummy update function for view-only mode
  const dummyUpdate = () => {};

  useEffect(() => {
    if (reportId) {
      const fetchedReport = getReport(reportId);
      if (fetchedReport) {
        setReport(fetchedReport);
      } else if (!loading) {
        navigate("/reports");
      }
    }
  }, [reportId, getReport, navigate, loading]);

  useEffect(() => {
    const fetchClientName = async () => {
      if (report?.client_id) {
        const { data, error } = await supabase
          .from("clients")
          .select("name")
          .eq("id", report.client_id)
          .single();

        if (error) {
          console.error("Error fetching client name:", error);
        } else if (data) {
          setClientName(data.name);
        }
      }
    };

    fetchClientName();
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
            The requested report could not be found.
          </p>
          <Link
            to="/reports"
            className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Reports
          </Link>
        </div>
      </div>
    );
  }

  const nextPage = () => {
    if (currentPage < report.sections.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentPageData = report.sections[currentPage];

  const renderPageContent = () => {
    switch (currentPageData.type) {
      case "overview":
        return (
          <div>
            <OverviewSection section={currentPageData} onUpdate={dummyUpdate} />
          </div>
        );
      case "executive_summary":
        return (
          <div>
            <ExecutiveSummarySection
              section={currentPageData as any}
              isEditable={false}
              onUpdate={dummyUpdate}
            />
          </div>
        );
      case "sales_overview":
        return (
          <div>
            <SalesOverviewSection
              section={currentPageData as any}
              isEditable={false}
              onUpdate={dummyUpdate}
            />
          </div>
        );
      case "platform_sales_value":
        return (
          <div>
            <PlatformSalesValueSection
              section={currentPageData as any}
              isEditable={false}
              onUpdate={dummyUpdate}
            />
          </div>
        );
      case "volume_sales_value":
        return (
          <div>
            <VolumeSalesValueSection
              section={currentPageData}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );
      case "top_categories":
        return (
          <div>
            <TopCategoriesSection
              section={currentPageData}
              onUpdate={dummyUpdate}
            />
          </div>
        );
      case "store_sales_value":
        return (
          <div>
            <StoreValueSection
              section={currentPageData}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );
      case "brand_performance_platform":
        return (
          <div>
            <BrandPerformancePlatformSection
              section={currentPageData}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );
      case "brand_performance_sub_category":
        return (
          <div>
            <BrandPerformanceSubCategorySection
              section={currentPageData}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );
      case "top_listing_performance":
        return (
          <div>
            <TopListingPerformanceSection
              section={currentPageData}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );
      case "top_reseller":
        return (
          <div>
            <TopResellerSection
              section={currentPageData}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );
      case "flashsale":
        return (
          <div>
            <FlashSaleSection
              section={currentPageData}
              onUpdate={dummyUpdate}
            />
          </div>
        );
      case "banner":
        return (
          <div>
            <BannerSection section={currentPageData} onUpdate={dummyUpdate} />
          </div>
        );
      case "divider":
        return (
          <div>
            <DividerSection
              section={currentPageData}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );
      case "top_brand_channel":
        return (
          <div>
            <TopBrandChannelSection
              section={currentPageData as any}
              onUpdate={dummyUpdate}
              isEditable={false}
            />
          </div>
        );

      case "opening":
        return (
          <OpeningSection
            section={currentPageData}
            onUpdate={dummyUpdate}
            period={report.period}
            client={clientName}
          />
        );

      case "customer_performance":
        return (
          <CustomerPerformanceSection
            section={currentPageData}
            onUpdate={dummyUpdate}
            isEditable={false}
          />
        );
      case "product_insights":
        return (
          <ProductInsightsSection
            section={currentPageData as any}
            onUpdate={dummyUpdate}
            isEditable={false}
          />
        );
      case "seasonal_patterns":
        return (
          <SeasonalPatternsSection
            section={currentPageData as any}
            onUpdate={dummyUpdate}
            isEditable={false}
          />
        );
      case "geographic_intelligence":
        return (
          <GeographicIntelligenceSection
            section={currentPageData as any}
            onUpdate={dummyUpdate}
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
              {report.sections.map((section: ReportSection, index: number) => (
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
          <div className="p-4 space-y-3 border-t border-gray-200">
            <DownloadButton
              reportTitle={report.title || "Report"}
              variant="dropdown"
              className="w-full"
            />
            <button
              className="flex items-center justify-center w-full px-4 py-2 text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              onClick={handleShare}
              disabled={shareLoading}
            >
              <Share2 size={18} className="mr-2" />
              {shareLoading ? "Generating..." : "Share Report"}
            </button>
            {/* Share Modal */}
            {shareModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                  <button
                    className="absolute text-gray-400 top-3 right-3 hover:text-gray-600"
                    onClick={() => setShareModalOpen(false)}
                  >
                    <X size={20} />
                  </button>
                  <h3 className="flex items-center mb-2 text-lg font-semibold text-gray-900">
                    <Share2 size={20} className="mr-2" />
                    Share Report
                  </h3>
                  <p className="mb-4 text-gray-600">
                    Anyone with this link can view the report (read-only).
                  </p>
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-l-md focus:outline-none"
                      value={shareUrl}
                      readOnly
                    />
                    <button
                      onClick={handleCopy}
                      className={`px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 flex items-center transition-colors duration-200 ${
                        copySuccess ? "bg-green-600 hover:bg-green-700" : ""
                      }`}
                    >
                      {copySuccess ? (
                        <Check size={18} className="mr-1" />
                      ) : null}
                      {copySuccess ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <button
                    className="w-full py-2 mt-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setShareModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content (single section view) */}
      <div className="flex flex-col flex-1" id="report-viewer-pdf-content">
        {/* ...existing code for top bar and current section... */}
        <div className="px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-gray-400 lg:hidden hover:text-gray-600"
              >
                <Menu size={20} />
              </button>
              <Link
                to="/reports"
                className="flex items-center text-gray-600 transition-colors duration-200 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Reports
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Page {currentPage + 1} of {report.sections.length}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextPage}
                  disabled={currentPage === report.sections.length - 1}
                  className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 mx-auto max-w-7xl">
            <div
              className="relative w-full bg-white border border-gray-200 rounded-lg shadow-sm"
              style={{ aspectRatio: "16/9", minHeight: "400px" }}
            >
              <div className="absolute inset-0 flex flex-col p-8">
                <div className="mb-6">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    {currentPageData.title}
                  </h1>
                  <div className="w-16 h-1 bg-blue-600 rounded"></div>
                </div>
                <div className="flex-1 overflow-auto">
                  {renderPageContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
        <div className="p-8 mx-auto max-w-7xl">
          {report.sections.map((section) => (
            <div
              key={section.id}
              data-section-id={section.id}
              className="relative w-full mb-8 bg-white border border-gray-200 rounded-lg shadow-sm"
              style={{
                aspectRatio: "16/9",
                minHeight: "400px",
                pageBreakAfter: "always",
              }}
            >
              <div className="absolute inset-0 flex flex-col p-8">
                <div className="mb-6">
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    {section.title}
                  </h1>
                  <div className="w-16 h-1 bg-blue-600 rounded"></div>
                </div>
                <div className="flex-1 overflow-auto">
                  {/* Render section content using the same logic as renderPageContent */}
                  {(() => {
                    switch (section.type) {
                      case "overview":
                        return (
                          <OverviewSection
                            section={section}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "executive_summary":
                        return (
                          <ExecutiveSummarySection
                            section={section as any}
                            isEditable={false}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "sales_overview":
                        return (
                          <SalesOverviewSection
                            section={section as any}
                            isEditable={false}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "platform_sales_value":
                        return (
                          <PlatformSalesValueSection
                            section={section as any}
                            isEditable={false}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "volume_sales_value":
                        return (
                          <VolumeSalesValueSection
                            section={section}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "top_categories":
                        return (
                          <TopCategoriesSection
                            section={section}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "store_sales_value":
                        return (
                          <StoreValueSection
                            section={section}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "brand_performance_platform":
                        return (
                          <BrandPerformancePlatformSection
                            section={section}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "brand_performance_sub_category":
                        return (
                          <BrandPerformanceSubCategorySection
                            section={section}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "top_listing_performance":
                        return (
                          <TopListingPerformanceSection
                            section={section}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "top_reseller":
                        return (
                          <TopResellerSection
                            section={section}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "flashsale":
                        return (
                          <FlashSaleSection
                            section={section}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "banner":
                        return (
                          <BannerSection
                            section={section}
                            onUpdate={dummyUpdate}
                          />
                        );
                      case "divider":
                        return (
                          <DividerSection
                            section={section}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "top_brand_channel":
                        return (
                          <TopBrandChannelSection
                            section={section as any}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "opening":
                        return (
                          <OpeningSection
                            section={section}
                            onUpdate={dummyUpdate}
                            period={report.period}
                            client={clientName}
                          />
                        );
                      case "customer_performance":
                        return (
                          <CustomerPerformanceSection
                            section={section as any}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "product_insights":
                        return (
                          <ProductInsightsSection
                            section={section as any}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "seasonal_patterns":
                        return (
                          <SeasonalPatternsSection
                            section={section as any}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      case "geographic_intelligence":
                        return (
                          <GeographicIntelligenceSection
                            section={section as any}
                            onUpdate={dummyUpdate}
                            isEditable={false}
                          />
                        );
                      default:
                        return null;
                    }
                  })()}
                </div>
              </div>
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

export default ReportViewer;
