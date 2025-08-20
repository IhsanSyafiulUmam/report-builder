import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { supabase } from "../supabaseClient";

export interface QueryItem {
  id: string;
  query: string;
}

export interface ReportSectionContent {
  text: string;
  queries?: QueryItem[];
  chart?: {
    type: string;
    data: Array<{ name: string; value: number; value2?: number }>;
    title: string;
  };
  table?: Record<string, any>;
  chartConfig?: {
    type: string;
    data: Array<{ name: string; value: number; value2?: number }>;
    title: string;
  };
}

export interface BigQueryConfig {
  queries: Array<{
    id: string;
    sql: string;
    name: string;
  }>;
  lastRun?: string;
  cacheData?: any;
  cacheExpiry?: string;
}

export interface ReportSection {
  id: string;
  type: string;
  title: string;
  content: ReportSectionContent;
  bigQueryConfig?: BigQueryConfig;
  number?: number;
}

export interface Report {
  id: string;
  title: string;
  client_id: string;
  folder_id?: string;
  status: "draft" | "in_progress" | "review" | "completed";
  brandFilter?: string;
  period?: string;
  sections: ReportSection[];
  created_at: string;
  updated_at: string;
  createdAt?: string;
  updatedAt?: string;
  public_token?: string; // for public sharing
}

interface SupabaseReport {
  id: string;
  title: string;
  client_id: string;
  status: "draft" | "in_progress" | "review" | "completed";
  sections: ReportSection[];
  created_at: string;
  updated_at: string;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: {
    title: string;
    client_id: string;
    status: "draft" | "in_progress" | "review" | "completed";
    period: string;
    brand_filter: string;
    sections: ReportSection[];
  }) => Promise<{
    id: string;
    title: string;
    client_id: string;
    status: string;
    sections: ReportSection[];
    createdAt: string;
    updatedAt: string;
  }>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReport: (id: string) => Report | undefined;
  loading: boolean;
  fetchReports: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Fetched data:", data);

      // Convert timestamps to strings if needed
      const formattedReports = data.map((report: SupabaseReport) => {
        const { created_at, updated_at, ...rest } = report;
        return {
          ...rest,
          created_at,
          updated_at,
          createdAt: new Date(created_at).toISOString(),
          updatedAt: new Date(updated_at).toISOString(),
        };
      });

      setReports(formattedReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const addReport = useCallback(
    async (report: {
      title: string;
      client_id: string;
      period: string;
      brand_filter: string;
      status: Report["status"];
      sections: ReportSection[];
    }): Promise<{
      id: string;
      title: string;
      client_id: string;
      status: string;
      sections: ReportSection[];
      createdAt: string;
      updatedAt: string;
    }> => {
      try {
        const { data, error } = await supabase
          .from("reports")
          .insert({
            title: report.title,
            client_id: report.client_id,
            status: report.status,
            period: report.period,
            brand_filter: report.brand_filter,
            sections: report.sections,
          })
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Added report data:", data);

        const { created_at, updated_at, ...rest } = data;
        const formattedReport = {
          ...rest,
          createdAt: new Date(created_at).toISOString(),
          updatedAt: new Date(updated_at).toISOString(),
        };

        setReports((prev) => [formattedReport, ...prev]);
        return formattedReport;
      } catch (error) {
        console.error("Error adding report:", error);
        throw error;
      }
    },
    []
  );

  const updateReport = useCallback(
    async (id: string, updates: Partial<Report>) => {
      try {
        const { data, error } = await supabase
          .from("reports")
          .update({
            title: updates.title,
            client_id: updates.client_id,
            status: updates.status,
            sections: updates.sections,
            folder_id: updates.folder_id,
            brand_filter: updates.brandFilter,
            period: updates.period,
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Updated report data:", data);

        // Convert timestamps to strings if needed
        const formattedReport = {
          ...data,
          createdAt: new Date(data.created_at).toISOString(),
          updatedAt: new Date(data.updated_at).toISOString(),
        };

        setReports((prev) =>
          prev.map((report) => (report.id === id ? formattedReport : report))
        );
      } catch (error) {
        console.error("Error updating report:", error);
        throw error;
      }
    },
    []
  );

  const deleteReport = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from("reports").delete().eq("id", id);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Deleted report:", id);

      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  }, []);

  const getReport = useCallback(
    (id: string) => {
      return reports.find((report) => report.id === id);
    },
    [reports]
  );

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        deleteReport,
        getReport,
        loading,
        fetchReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export { ReportContext };
