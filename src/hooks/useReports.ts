import { useContext } from "react";
import { ReportContext } from "../contexts/ReportContext";

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within a ReportProvider");
  }
  return context;
};
