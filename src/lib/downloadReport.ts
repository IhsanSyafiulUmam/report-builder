// Simple utility to download a JSON or HTML version of the report
export function downloadReport(report: any, format: "json" | "html" = "json") {
  if (format === "json") {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(report, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${report.title || "report"}.json`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  } else if (format === "html") {
    // For now, just a simple HTML wrapper
    const html = `<!DOCTYPE html><html><head><title>${
      report.title || "Report"
    }</title></head><body><pre>${JSON.stringify(
      report,
      null,
      2
    )}</pre></body></html>`;
    const dataStr = "data:text/html;charset=utf-8," + encodeURIComponent(html);
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${report.title || "report"}.html`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  }
}
