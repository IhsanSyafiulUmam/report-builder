import { supabase } from "../../supabaseClient";
import { processSection } from "./processSection";

export async function processReport(
  reportId: string,
  onProgress?: (current: number, total: number) => void
) {
  const { data: report, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .single();

  if (error || !report) throw new Error("Report not found");

  // Fetch client data
  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("*")
    .eq("id", report.client_id)
    .single();
  if (clientError || !client) throw new Error("Client not found");

  const updatedSections = [];
  const total = report.sections.length;

  for (let i = 0; i < report.sections.length; i++) {
    const section = report.sections[i];
    const updated = await processSection(section, {
      clientId: report.client_id,
      period: report.period,
      brandFilter: report.brand_filter,
      dataset: report.dataset,
      databaseSource: report.database_source, // Pass database source to processor
    });
    updatedSections.push(updated);
    if (onProgress) onProgress(i + 1, total);
  }

  await supabase
    .from("reports")
    .update({ sections: updatedSections })
    .eq("id", reportId);

  return updatedSections;
}
