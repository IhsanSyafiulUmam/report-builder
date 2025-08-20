import { ReportSection } from "../../contexts/ReportContext";
import { runQuery } from "../bigquery/runQuery";
import { queryTemplates } from "../queryTemplates";

type QueryTemplate = { id: string; query: string };
interface QueryTemplates {
  [key: string]: QueryTemplate[];
}
const typedQueryTemplates: QueryTemplates = queryTemplates as QueryTemplates;
import * as processors from "./sectionProcessors";

export async function processSection(
  section: ReportSection,
  meta: { clientId: string; period: string, brandFilter?: string, dataset?: string }
): Promise<ReportSection> {
  const queries: QueryTemplate[] =
    Array.isArray(section.content?.queries) &&
    section.content.queries.length > 0
      ? section.content.queries
      : typedQueryTemplates[section.type] || [];
  if (!queries || queries.length === 0) return section;
  console.log("Processing section:", section.id, "of type:", section.type);

  const queryResults: Record<string, any> = {};
  for (const { id, query } of queries) {
    const result = await runQuery(query, {
      clientId: meta.clientId,
      period: meta.period,
    });
    console.log(`Query ${id} executed for section ${section.id}:`, result);
    queryResults[id] = result;
  }

  const customProcessor = (processors as Record<string, any>)[section.type];
  if (!customProcessor) {
    console.warn(`No processor found for section type: ${section.type}`);
    return section;
  }
  const newContent = await customProcessor(queryResults, meta);

  const mergedContent = {
    ...section.content,
    ...(newContent && typeof newContent === "object"
      ? { chartData: newContent.chartData }
      : {}),
  };

  return {
    ...section,
    content: mergedContent,
  };
}
