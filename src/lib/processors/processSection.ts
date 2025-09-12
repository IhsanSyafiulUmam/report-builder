import { ReportSection } from "../../contexts/ReportContext";
import { runQuery } from "../bigquery/runQuery";
import { runUniversalQuery } from "../universalQuery";
import { queryTemplates, QueryTemplate } from "../queryTemplates";

interface QueryTemplates {
  [key: string]: QueryTemplate[];
}
const typedQueryTemplates: QueryTemplates = queryTemplates as QueryTemplates;
import * as processors from "./sectionProcessors";

export async function processSection(
  section: ReportSection,
  meta: {
    clientId: string;
    period: string;
    brandFilter?: string;
    dataset?: string;
    databaseSource?: "bigquery" | "clickhouse"; // Add database source to meta
  }
): Promise<ReportSection> {
  const queries: QueryTemplate[] =
    Array.isArray(section.content?.queries) &&
    section.content.queries.length > 0
      ? section.content.queries
      : typedQueryTemplates[section.type] || [];
  if (!queries || queries.length === 0) return section;
  console.log("Processing section:", section.id, "of type:", section.type);

  const queryResults: Record<string, unknown> = {};
  for (const query of queries) {
    const { id, query: sql, database } = query;
    let result;

    // Determine which database to use:
    // 1. Use database from query template if specified
    // 2. Use databaseSource from report/meta if available
    // 3. Default to bigquery for backward compatibility
    const targetDatabase = database || meta.databaseSource || "bigquery";

    if (targetDatabase === "bigquery") {
      // Use existing BigQuery implementation for backward compatibility
      result = await runQuery(sql, {
        clientId: meta.clientId,
        period: meta.period,
      });
    } else {
      // Use universal query runner for other databases
      result = await runUniversalQuery({
        sql,
        database: targetDatabase,
        params: {
          clientId: meta.clientId,
          period: meta.period,
        },
      });
    }

    console.log(
      `Query ${id} executed for section ${section.id} on ${targetDatabase}:`,
      result
    );
    queryResults[id] = result;
  }

  const customProcessor = (
    processors as Record<
      string,
      (queryResults: Record<string, unknown>, meta: unknown) => unknown
    >
  )[section.type];
  if (!customProcessor || typeof customProcessor !== "function") {
    console.warn(`No processor found for section type: ${section.type}`);
    return section;
  }
  const newContent = customProcessor(queryResults, meta);

  const mergedContent = {
    ...section.content,
    ...(newContent && typeof newContent === "object"
      ? {
          chartData: (newContent as { chartData?: unknown }).chartData,
          // Note: No flattening for chart sections to avoid data duplication
          // Components should access data via section.content.chartData
        }
      : {}),
  };

  return {
    ...section,
    content: mergedContent,
  };
}
