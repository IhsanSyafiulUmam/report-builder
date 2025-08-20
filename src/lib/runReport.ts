import { processReport } from "./processors/processReport";

export async function runReport(
  reportId: string,
  onProgress?: (current: number, total: number) => void
) {
  if (!reportId) throw new Error("reportId wajib diisi");

  try {
    const updatedSections = await processReport(reportId, onProgress);
    return { success: true, updatedSections };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
