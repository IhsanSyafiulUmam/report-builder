import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export interface Folder {
  id: string;
  name: string;
  user_id: string;
  created_at: string;
  public_token?: string; // untuk share folder
}

interface FolderContextType {
  folders: Folder[];
  fetchFolders: (user_id: string) => Promise<void>;
  addFolder: (name: string, user_id: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  moveReportToFolder: (
    report_id: string,
    folder_id: string | null
  ) => Promise<void>;
  loading: boolean;
}

const FolderContext = createContext<FolderContextType | undefined>(undefined);

export const useFolders = () => {
  const context = useContext(FolderContext);
  if (!context) {
    throw new Error("useFolders must be used within a FolderProvider");
  }
  return context;
};

export const FolderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFolders = async (user_id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching folders:", error);
    } else if (data) {
      setFolders(data);
    }
    setLoading(false);
  };

  const addFolder = async (name: string, user_id: string) => {
    console.log("[DEBUG] Adding Folder", { name, user_id });
    setLoading(true);
    const { error } = await supabase
      .from("folders")
      .insert([{ name, user_id }]);
    if (error) {
      console.error("Error adding folder:", error);
      throw error;
    }
    setLoading(false);
  };

  const deleteFolder = async (id: string) => {
    setLoading(true);
    const { error } = await supabase.from("folders").delete().eq("id", id);
    if (error) {
      console.error("Error deleting folder:", error);
      throw error;
    }
    setLoading(false);
  };

  const moveReportToFolder = async (
    report_id: string,
    folder_id: string | null
  ) => {
    setLoading(true);
    const { error } = await supabase
      .from("reports")
      .update({ folder_id })
      .eq("id", report_id);
    if (error) {
      console.error("Error moving report:", error);
      throw error;
    }
    setLoading(false);
  };

  return (
    <FolderContext.Provider
      value={{
        folders,
        fetchFolders,
        addFolder,
        deleteFolder,
        moveReportToFolder,
        loading,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
