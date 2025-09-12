import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Save, Eye, Trash2, Loader2 } from "lucide-react";
import ReportSection from "../components/report/ReportSection";
import SectionTemplates from "../components/report/SectionTemplates";
import DownloadButton from "../components/report/DownloadButton";
import { useReports } from "../contexts/ReportContext";
import { useClients } from "../contexts/ClientContext";
import { runReport } from "../lib/runReport";
import { queryTemplates } from "../lib/queryTemplates";

interface ChartConfig {
  type: string;
  data: Array<{ name: string; value: number; value2?: number }>;
  title: string;
}

interface QueryItem {
  id: string;
  query: string;
}

interface ReportSectionContent {
  text: string;
  queries?: QueryItem[];
  chart?: ChartConfig;
  table?: object;
  chartConfig?: ChartConfig;
}

interface ReportSectionType {
  id: string;
  type: string;
  title: string;
  content: ReportSectionContent;
}

interface Report {
  id: string;
  title: string;
  client_id: string;
  status?: string;
  period?: string;
  brand_filter?: string;
  database_source?: "bigquery" | "clickhouse"; // Add database source
  sections: ReportSectionType[];
}

type SavedData = {
  title: string;
  client_id: string;
  status: string;
  period: string;
  brand_filter: string;
  database_source: "bigquery" | "clickhouse"; // Add database source
  sections: ReportSectionType[];
};

const ReportBuilder = () => {
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    setSections((prev) => {
      const newSections = [...prev];
      [newSections[index - 1], newSections[index]] = [
        newSections[index],
        newSections[index - 1],
      ];
      return newSections;
    });
  };

  const moveSectionDown = (index: number) => {
    setSections((prev) => {
      if (index === prev.length - 1) return prev;
      const newSections = [...prev];
      [newSections[index], newSections[index + 1]] = [
        newSections[index + 1],
        newSections[index],
      ];
      return newSections;
    });
  };
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { getReport, addReport, updateReport, loading } = useReports();
  const { clients } = useClients();

  const [reportTitle, setReportTitle] = useState("Untitled Report");
  const [selectedClient, setSelectedClient] = useState("");
  const [sections, setSections] = useState<ReportSectionType[]>([]); // Always an array
  const [showTemplates, setShowTemplates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState({ current: 0, total: 0 });
  const [period, setPeriod] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [databaseSource, setDatabaseSource] = useState<
    "bigquery" | "clickhouse"
  >("bigquery");

  useEffect(() => {
    if (reportId && reportId !== "new") {
      const report: Report | undefined = getReport(reportId);
      if (report) {
        setReportTitle(report.title);
        setSelectedClient(report.client_id);
        setPeriod(report.period || "");
        setBrandFilter(report.brand_filter || "");
        setDatabaseSource(report.database_source || "bigquery"); // Load database source
        const seenIds = new Set<string>();
        const safeSections = Array.isArray(report.sections)
          ? report.sections.map((section, idx) => {
              let safeId = section.id
                ? String(section.id)
                : `section-${Date.now()}-${Math.random()
                    .toString(36)
                    .substr(2, 6)}`;
              if (seenIds.has(safeId)) safeId = safeId + "-" + idx;
              seenIds.add(safeId);
              return { ...section, id: safeId };
            })
          : [];
        setSections(safeSections);
      }
    } else {
      setSections([
        {
          id: "section-1",
          type: "opening",
          title: "",
          content: {
            text: "",
            chart: undefined,
            table: undefined,
            chartConfig: undefined,
          },
        },
      ]);
      setPeriod("");
      setBrandFilter("");
    }
  }, [reportId, getReport]);

  const addSection = (type: string) => {
    const uniqueId = `section-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)}`;

    type TemplateItem = { id: string; query: string };
    const tmap = queryTemplates as Record<string, TemplateItem[]>;
    const queries = (tmap[type] || []).map((q: TemplateItem) => ({
      id: q.id,
      query: q.query,
    }));

    const newSection: ReportSectionType = {
      id: uniqueId,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: {
        text: "",
        queries,
        chart: undefined,
        table: undefined,
        chartConfig: undefined,
      },
    };
    setSections([...sections, newSection]);
    setShowTemplates(false);
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<ReportSectionType>
  ) => {
    setSections(
      sections.map((section) => {
        if (section.id !== sectionId) return section;
        // If updates.content exists, merge it with section.content
        if (updates.content) {
          return {
            ...section,
            ...updates,
            content: {
              ...section.content,
              ...updates.content,
            },
          };
        }
        return { ...section, ...updates };
      })
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (!reportTitle.trim()) {
      alert("Please enter a report title");
      return;
    }
    if (!selectedClient) {
      alert("Please select a client");
      return;
    }
    if (sections.length === 0) {
      alert("Please add at least one section");
      return;
    }

    setIsSaving(true);
    try {
      // Ensure every section has queries, if not, load from queryTemplates
      const fixedSections = sections.map((section) => {
        let queries = section.content.queries;
        if (!queries || queries.length === 0) {
          const tmap2 = queryTemplates as Record<
            string,
            { id: string; query: string }[]
          >;
          queries = (tmap2[section.type] || []).map((q) => ({
            id: q.id,
            query: q.query,
          }));
        }
        return {
          ...section,
          title: section.title.trim(),
          content: {
            ...section.content,
            text: section.content.text.trim(),
            queries,
          },
        };
      });

      console.log(brandFilter)

      const reportData = {
        title: reportTitle.trim(),
        client_id: selectedClient,
        status: "draft" as const,
        period: period,
        brand_filter: brandFilter,
        database_source: databaseSource, // Include database source
        sections: fixedSections,
      };

      console.log(reportData)

      if (reportId && reportId !== "new") {
        await updateReport(reportId, reportData);
      } else {
        const created = await addReport(reportData);
        if (created && created.id) {
          // Redirect to report detail (viewer) after successful creation
          navigate(`/reports/builder/${created.id}`);
          return;
        }
      }
    } catch (error) {
      console.error("Error saving report:", error);
      alert("Failed to save report. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const [lastSavedData, setLastSavedData] = useState<SavedData | null>(null);
  useEffect(() => {
    if (!reportId || reportId === "new") return;
    if (!reportTitle.trim() || !selectedClient || sections.length === 0) return;
    const timer = setTimeout(async () => {
      if (isSaving) return;
      const reportData = {
        title: reportTitle.trim(),
        client_id: selectedClient,
        status: "draft" as const,
        period: period,
        brand_filter: brandFilter,
        database_source: databaseSource,
        sections: sections.map((section) => ({
          ...section,
          title: section.title.trim(),
          content: {
            ...section.content,
            text: section.content.text.trim(),
          },
        })),
      };
      const isChanged =
        JSON.stringify(reportData) !== JSON.stringify(lastSavedData);
      if (isChanged) {
        try {
          await updateReport(reportId, reportData);
          setLastSavedData(reportData);
        } catch (e) {
          console.error("Auto-save update failed", e);
        }
      }
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportTitle, selectedClient, sections, reportId]);
  useEffect(() => {
    if (!reportId || reportId === "new") return;
    const report: Report | undefined = getReport(reportId);
    if (report) {
      const cleanData = {
        title: report.title?.trim() || "",
        client_id: report.client_id || "",
        status: report.status || "draft",
        period: report.period || "",
        brand_filter: report.brand_filter || "",
        database_source: report.database_source || "bigquery",
        sections: Array.isArray(report.sections)
          ? report.sections.map((section: ReportSectionType) => ({
              ...section,
              title: section.title?.trim() || "",
              content: {
                ...section.content,
                text: section.content?.text?.trim() || "",
              },
            }))
          : [],
      };
      setLastSavedData(cleanData);
    }
  }, [reportId, getReport]);

  const handleRunQuery = async () => {
    if (!reportId) {
      alert("Report ID tidak ditemukan.");
      return;
    }
    setIsRunning(true);
    setRunProgress({ current: 0, total: sections.length });
    try {
      const result = await runReport(reportId, (current, total) => {
        setRunProgress({ current, total });
      });
      if (result.success) {
        if (Array.isArray(result.updatedSections)) {
          setSections(result.updatedSections);
        }
      } else {
        alert(`Failed to process report: ${result.error}`);
      }
    } catch (error) {
      console.error("Error running report query:", error);
      alert("An unexpected error occurred while processing the report.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Loading Modal for Running Report */}
      {isRunning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="flex flex-col items-center px-8 py-10 bg-white rounded-3xl shadow-2xl border border-gray-100 min-w-[360px]">
            <div className="mb-6 text-blue-500 animate-spin">
              <Loader2 size={48} />
            </div>
            <div className="mb-3 text-xl font-semibold text-gray-900">
              Processing Report...
            </div>
            <div className="w-full mb-4 text-sm text-center text-gray-500">{`Section ${runProgress.current} of ${runProgress.total}`}</div>
            <div className="w-full h-2 overflow-hidden bg-gray-100 rounded-full">
              <div
                className="h-full transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{
                  width: `${
                    runProgress.total
                      ? (runProgress.current / runProgress.total) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor */}
      <div className="flex flex-col flex-1 min-h-0" id="report-pdf-content">
        {/* Header */}
        <div className="px-8 py-6 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <input
                type="text"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full text-2xl font-bold text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:placeholder-gray-300"
                placeholder="Untitled Report"
              />
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="mt-2 text-sm text-gray-600 transition-colors bg-transparent border-none outline-none cursor-pointer hover:text-gray-800"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <DownloadButton
                reportTitle={reportTitle || "Report"}
                variant="button"
                className="px-4 py-2.5"
              />
              <button
                className="flex items-center px-5 py-2.5 text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (reportId && reportId !== "new") {
                    navigate(`/reports/view/${reportId}`);
                  }
                }}
                disabled={!reportId || reportId === "new"}
              >
                <Eye size={18} className="mr-2" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || loading}
                className="flex items-center px-6 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSaving ? (
                  <Loader2 size={18} className="mr-2 animate-spin" />
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </button>

              <button
                onClick={handleRunQuery}
                className="flex items-center px-6 py-2.5 text-white bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl hover:from-emerald-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <Loader2 size={18} className="mr-2" />
                Run Query
              </button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="mx-auto space-y-8 max-w-8xl">
            {/* Report Info */}
            <div className="p-8 bg-white border border-gray-200 shadow-sm rounded-2xl">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                Report Configuration
              </h3>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white"
                    placeholder="Enter report title"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Client
                  </label>
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white"
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Period
                  </label>
                  <input
                    type="month"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Brand Filter
                  </label>
                  <input
                    type="text"
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                    placeholder="e.g. Erha, Somethinc, Wardah"
                    className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-200 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Database Source
                  </label>
                  <select
                    value={databaseSource}
                    onChange={(e) =>
                      setDatabaseSource(
                        e.target.value as "bigquery" | "clickhouse"
                      )
                    }
                    className="w-full px-4 py-3 transition-all duration-200 border border-gray-200 cursor-pointer rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white"
                  >
                    <option value="bigquery">BigQuery</option>
                    <option value="clickhouse">ClickHouse</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sections */}
            {sections.length > 0 ? (
              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="relative w-full transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-md"
                    style={{ aspectRatio: "16/9", minHeight: "400px" }}
                  >
                    <div className="absolute inset-0 flex flex-col">
                      <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center space-x-4">
                          <div className="flex space-x-1">
                            <button
                              onClick={() => moveSectionUp(index)}
                              disabled={index === 0}
                              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-blue-600 disabled:opacity-30 hover:bg-blue-50"
                              title="Move Up"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => moveSectionDown(index)}
                              disabled={index === sections.length - 1}
                              className="p-2 text-gray-400 transition-colors rounded-lg hover:text-blue-600 disabled:opacity-30 hover:bg-blue-50"
                              title="Move Down"
                            >
                              ▼
                            </button>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                              Section {index + 1}
                            </span>
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) =>
                                updateSection(section.id, {
                                  title: e.target.value,
                                })
                              }
                              className="px-2 py-1 text-lg font-semibold text-gray-900 transition-colors bg-transparent border-none rounded-lg outline-none focus:bg-gray-50"
                              placeholder="Section title"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => deleteSection(section.id)}
                          className="p-2.5 text-gray-400 transition-all duration-200 hover:text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="flex-1 overflow-auto">
                        {/** Find client name by selectedClient id */}
                        <ReportSection
                          period={period}
                          client={
                            clients.find((c) => c.id === selectedClient)
                              ?.name || ""
                          }
                          section={section}
                          onUpdate={(updates) =>
                            updateSection(section.id, updates)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <svg
                    viewBox="0 0 64 64"
                    fill="currentColor"
                    className="w-full h-full"
                  >
                    <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm8 28h-6v6c0 1.105-.895 2-2 2s-2-.895-2-2v-6h-6c-1.105 0-2-.895-2-2s.895-2 2-2h6v-6c0-1.105.895-2 2-2s2 .895 2 2v6h6c1.105 0 2 .895 2 2s-.895 2-2 2z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  No sections yet
                </h3>
                <p className="mb-6 text-gray-500">
                  Get started by adding your first section to the report.
                </p>
                <button
                  onClick={() => setShowTemplates(true)}
                  className="inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-200 shadow-lg bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
                >
                  <Plus size={20} className="mr-2" />
                  Add Your First Section
                </button>
              </div>
            )}

            {/* Add Section Button */}
            {sections.length > 0 && (
              <div className="text-center">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="inline-flex items-center px-8 py-4 font-medium text-gray-600 transition-all duration-200 bg-white border-2 border-gray-300 border-dashed group rounded-2xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                >
                  <Plus
                    size={20}
                    className="mr-3 transition-transform duration-200 group-hover:rotate-90"
                  />
                  <span className="font-semibold">Add Section</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates Sidebar */}
      {showTemplates && (
        <SectionTemplates
          onAddSection={addSection}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
};

export default ReportBuilder;
