import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, FileText, Eye, Copy, Calendar } from "lucide-react";
import { supabase } from "../supabaseClient";
import { Report } from "../contexts/ReportContext";

const PublicFolderViewer = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<{ name: string } | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const fetchFolderAndReports = async () => {
      setLoading(true);
      // Fetch folder by public_token
      const { data: folderData } = await supabase
        .from("folders")
        .select("*")
        .eq("public_token", token)
        .single();
      if (!folderData) {
        setFolder(null);
        setReports([]);
        setLoading(false);
        return;
      }
      setFolder(folderData);
      // Fetch reports in this folder
      const { data: reportsData } = await supabase
        .from("reports")
        .select("*")
        .eq("folder_id", folderData.id)
        .order("created_at", { ascending: false });
      setReports(reportsData || []);
      setLoading(false);
    };
    if (token) fetchFolderAndReports();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Folder Not Found
          </h2>
          <p className="mb-4 text-gray-600">
            The requested public folder could not be found.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 w-full py-6 border-b border-gray-200 shadow-sm bg-white/80">
        <div className="flex flex-col gap-2 px-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 truncate">
                {folder.name}
              </h2>
              <p className="text-xs text-gray-500">Public Folder</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {reports.length} Report{reports.length !== 1 ? "s" : ""}
            </span>
            <button
              className="p-2 text-gray-400 transition-colors rounded-full hover:text-blue-600 hover:bg-blue-50"
              title="Copy Folder Link"
              onClick={async () => {
                const url = window.location.href;
                try {
                  await navigator.clipboard.writeText(url);
                  alert("Link folder berhasil disalin!");
                } catch {
                  alert("Gagal menyalin link");
                }
              }}
            >
              <Copy size={18} />
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-8 py-10">
          {reports.length === 0 ? (
            <div className="py-20 text-lg font-medium text-center text-gray-400">
              Tidak ada report di folder ini.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  to={`/public/report/${report.public_token}`}
                  className="relative block p-6 transition-all duration-200 bg-white border border-gray-200 shadow-sm cursor-pointer group rounded-2xl hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="text-blue-500 transition w-7 h-7 group-hover:text-blue-700" />
                    <span className="text-lg font-semibold text-gray-900 truncate transition group-hover:text-blue-700">
                      {report.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                    <Calendar size={14} />
                    {new Date(report.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Eye size={13} />
                    Public
                  </div>
                  <div className="absolute transition opacity-0 top-4 right-4 group-hover:opacity-100">
                    <Copy
                      size={16}
                      className="text-gray-300 cursor-pointer hover:text-blue-500"
                      onClick={async (e) => {
                        e.preventDefault();
                        const url = `${window.location.origin}/public/report/${report.public_token}`;
                        try {
                          await navigator.clipboard.writeText(url);
                          alert("Link report berhasil disalin!");
                        } catch {
                          alert("Gagal menyalin link");
                        }
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicFolderViewer;
