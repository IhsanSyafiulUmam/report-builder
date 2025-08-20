import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Copy,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react";
import { useReports } from "../contexts/ReportContext";
import { useFolders } from "../contexts/FolderContext";
import { useClients } from "../contexts/ClientContext";

const ReportsPage = () => {
  const { reports, loading, deleteReport, fetchReports, updateReport } =
    useReports();
  const [optimisticReports, setOptimisticReports] = useState(null);
  const {
    folders,
    fetchFolders,
    addFolder,
    moveReportToFolder,
    loading: foldersLoading,
  } = useFolders();
  const { clients } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  // Remove client filter, not in model
  const [selectedFolder, setSelectedFolder] = useState<string | "all">("all");
  // Remove selectedClient, always "all"
  const selectedClient = "all";
  const [newFolderName, setNewFolderName] = useState("");
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [user_id, setUserId] = useState<string>("");
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user from Supabase session
  useEffect(() => {
    const getUser = async () => {
      setAuthLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session || !data.session.user) {
        navigate("/login");
        return;
      }
      setUserId(data.session.user.id);
      setAuthLoading(false);
    };
    getUser();
    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session || !session.user) {
          navigate("/login");
        } else {
          setUserId(session.user.id);
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (user_id) fetchFolders(user_id);
  }, [fetchFolders, user_id]);

  const displayedReports = optimisticReports || reports;
  const filteredReports = displayedReports.filter((report) => {
    const matchesSearch = report.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || report.status === selectedStatus;
    const matchesFolder =
      selectedFolder === "all" || report.folder_id === selectedFolder;
    return matchesSearch && matchesStatus && matchesFolder;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      review: "bg-yellow-100 text-yellow-800",
      draft: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  // Calculate stats from actual reports
  const totalReports = reports.length;
  const completedReports = reports.filter(
    (r) => r.status === "completed"
  ).length;
  const inProgressReports = reports.filter(
    (r) => r.status === "in_progress"
  ).length;
  const totalViews = reports.reduce(
    (sum, r) => sum + ((r as { views?: number }).views || 0),
    0
  );

  // Format date for display
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "1 day ago";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteReport(id);
      } catch (error) {
        console.error("Error deleting report:", error);
        alert("Failed to delete report. Please try again.");
      }
    }
  };

  // Handler for adding folder
  // Handler for drag & drop with optimistic UI
  const onDragEnd = async (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    let newFolderId = null;
    if (destination.droppableId.startsWith("folder-")) {
      newFolderId = destination.droppableId.replace("folder-", "");
    } else if (destination.droppableId === "uncategorized") {
      newFolderId = null;
    } else {
      return;
    }

    // Optimistically update local state
    setOptimisticReports((prev) => {
      const base = prev || reports;
      return base.map((r) =>
        r.id === draggableId ? { ...r, folder_id: newFolderId } : r
      );
    });

    // Update on server
    try {
      await updateReport(draggableId, { folder_id: newFolderId });
      // Optionally, you can refresh from server after a delay or on error only
      // await fetchReports();
    } catch (err) {
      // Revert optimistic update on error
      setOptimisticReports(null);
      alert("Gagal memindahkan report. Silakan coba lagi.");
    }
  };
  const handleAddFolder = async () => {
    if (!newFolderName || !user_id) return;
    try {
      await addFolder(newFolderName, user_id);
      setNewFolderName("");
      await fetchFolders(user_id);
      setShowAddFolderModal(false);
    } catch (error) {
      alert("Gagal menambah folder. Cek koneksi atau user_id.");
    }
  };

  useEffect(() => {
    setOptimisticReports(null);
  }, [reports]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Add Folder Modal */}
      {showAddFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
            <button
              className="absolute text-xl text-gray-400 top-2 right-2 hover:text-gray-600"
              onClick={() => setShowAddFolderModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Add New Folder
            </h2>
            <input
              type="text"
              placeholder="New folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full px-2 py-2 mb-4 border rounded"
              autoFocus
            />
            <button
              className="w-full px-3 py-2 text-white bg-blue-600 rounded disabled:opacity-50"
              disabled={!newFolderName || !user_id}
              type="button"
              onClick={handleAddFolder}
            >
              + Add Folder
            </button>
          </div>
        </div>
      )}
      {/* Add Folder Button */}
      <div className="flex justify-end mb-2">
        <button
          className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={() => setShowAddFolderModal(true)}
        >
          + Add Folder
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* File Manager Folders Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {/* Folder Cards with Droppable */}
          {folders.map((folder) => {
            const reportsInFolder = displayedReports.filter(
              (r) => r.folder_id === folder.id
            );
            return (
              <Droppable droppableId={`folder-${folder.id}`} key={folder.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm min-h-[180px] ${
                      snapshot.isDraggingOver ? "ring-2 ring-blue-400" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                      <span className="text-lg font-bold text-blue-700 truncate">
                        {folder.name}
                      </span>
                      <button
                        className="p-2 ml-2 text-gray-400 transition-colors rounded-full hover:text-blue-600 hover:bg-blue-50"
                        title="Share Folder"
                        onClick={async () => {
                          let token = folder.public_token;
                          
                          if (!token) {
                            console.log("[DEBUG] Generating new token");
                            token = crypto.randomUUID();
                            const { error } = await supabase
                              .from("folders")
                              .update({ public_token: token })
                              .eq("id", folder.id);
                            if (error) {
                              alert("Gagal generate public link");
                              return;
                            }
                            if (user_id) fetchFolders(user_id);
                          }
                          const url = `${window.location.origin}/public/folder/${token}`;
                          try {
                            await navigator.clipboard.writeText(url);
                            alert("Link folder berhasil disalin!");
                          } catch {
                            alert("Gagal menyalin link");
                          }
                        }}
                        aria-label="Share Folder"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                      {reportsInFolder.length === 0 ? (
                        <div className="text-sm text-center text-gray-400">
                          No reports in this folder
                        </div>
                      ) : (
                        reportsInFolder.map((report, idx) => (
                          <Draggable
                            draggableId={report.id}
                            index={idx}
                            key={report.id}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 ${
                                  snapshot.isDragging
                                    ? "ring-2 ring-blue-400"
                                    : ""
                                }`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">
                                    {report.title}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Updated {formatDate(report.updatedAt)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Link
                                    to={`/reports/view/${report.id}`}
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                  >
                                    <Eye size={16} />
                                  </Link>
                                  <Link
                                    to={`/reports/builder/${report.id}`}
                                    className="p-1 text-gray-400 hover:text-blue-600"
                                  >
                                    <Edit3 size={16} />
                                  </Link>
                                  <button
                                    onClick={() =>
                                      moveReportToFolder(report.id, null)
                                    }
                                    className="p-1 text-gray-400 hover:text-yellow-600"
                                    title="Remove from folder"
                                  >
                                    🗂️
                                  </button>
                                  <button
                                    onClick={() => handleDelete(report.id)}
                                    className="p-1 text-gray-400 hover:text-red-600"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
          {/* Uncategorized Reports Card as Droppable */}
          <Droppable droppableId="uncategorized">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm min-h-[180px] ${
                  snapshot.isDraggingOver ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <span className="text-lg font-bold text-gray-700 truncate">
                    Uncategorized
                  </span>
                </div>
                <div className="flex-1 p-4 space-y-3 overflow-y-auto">
                  {displayedReports.filter((r) => !r.folder_id).length === 0 ? (
                    <div className="text-sm text-center text-gray-400">
                      No uncategorized reports
                    </div>
                  ) : (
                    displayedReports
                      .filter((r) => !r.folder_id)
                      .map((report, idx) => (
                        <Draggable
                          draggableId={report.id}
                          index={idx}
                          key={report.id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 ${
                                snapshot.isDragging
                                  ? "ring-2 ring-blue-400"
                                  : ""
                              }`}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {report.title}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Updated {formatDate(report.updatedAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link
                                  to={`/reports/view/${report.id}`}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                >
                                  <Eye size={16} />
                                </Link>
                                <Link
                                  to={`/reports/builder/${report.id}`}
                                  className="p-1 text-gray-400 hover:text-blue-600"
                                >
                                  <Edit3 size={16} />
                                </Link>
                                <button
                                  onClick={() => handleDelete(report.id)}
                                  className="p-1 text-gray-400 hover:text-red-600"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                  )}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Create and manage client reports</p>
        </div>
        <Link
          to="/reports/builder/new"
          className="inline-flex items-center px-4 py-2 mt-4 text-white transition-colors duration-200 bg-blue-600 rounded-lg sm:mt-0 hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          New Report
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">
                Total Reports
              </h3>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-green-600">
                {completedReports}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-bold text-blue-600">
                {inProgressReports}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg">
              <Eye className="w-4 h-4 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
              <p className="text-2xl font-bold text-purple-600">{totalViews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
            />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="relative overflow-hidden transition-all duration-200 bg-white border border-gray-100 shadow-md group rounded-2xl hover:shadow-xl"
          >
            {/* Status badge */}
            <span
              className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getStatusColor(
                report.status
              )}`}
              style={{ zIndex: 2 }}
            >
              {report.status === "completed" && (
                <Eye size={14} className="inline-block" />
              )}
              {report.status === "in_progress" && (
                <Edit3 size={14} className="inline-block" />
              )}
              {report.status === "review" && (
                <Copy size={14} className="inline-block" />
              )}
              {report.status === "draft" && (
                <FileText size={14} className="inline-block" />
              )}
              <span className="capitalize">
                {report.status.replace("_", " ")}
              </span>
            </span>
            <div className="flex flex-col h-full p-6">
              {/* Title */}
              <h3 className="mb-2 text-xl font-bold leading-tight text-gray-900 line-clamp-2">
                {report.title}
              </h3>
              {/* Meta info row */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FileText size={14} /> {report.sections.length} sections
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {formatDate(report.updatedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path
                      stroke="#64748b"
                      strokeWidth="2"
                      d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
                    />
                    <path stroke="#64748b" strokeWidth="2" d="M9 10h6m-6 4h6" />
                  </svg>
                  {folders.find((f) => f.id === report.folder_id)?.name ||
                    "No Folder"}
                </span>
                <span className="flex items-center gap-1">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="#64748b"
                      strokeWidth="2"
                    />
                    <path
                      stroke="#64748b"
                      strokeWidth="2"
                      d="M12 14c-2 0-4-1-4-3V9a4 4 0 1 1 8 0v2c0 2-2 3-4 3Z"
                    />
                  </svg>
                  {clients.find((c) => c.id === report.client_id)?.name ||
                    "No Client"}
                </span>
              </div>
             
              {/* Actions bar */}
              <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/reports/view/${report.id}`}
                    className="p-2 text-gray-400 transition-colors rounded-full hover:text-blue-600 hover:bg-blue-50"
                    title="View"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    to={`/reports/builder/${report.id}`}
                    className="p-2 text-gray-400 transition-colors rounded-full hover:text-green-600 hover:bg-green-50"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </Link>
                  <button
                    className="p-2 text-gray-400 transition-colors rounded-full hover:text-purple-600 hover:bg-purple-50"
                    title="Copy"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <button
                  onClick={() => handleDelete(report.id)}
                  className="p-2 text-gray-400 transition-colors rounded-full hover:text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="py-12 text-center">
          <FileText size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No reports found
          </h3>
          <p className="mb-6 text-gray-500">
            {searchTerm || selectedStatus !== "all" || selectedClient !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first report"}
          </p>
          <Link
            to="/reports/builder/new"
            className="inline-flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create Report
          </Link>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
