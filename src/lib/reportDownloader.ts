import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export interface DownloadOptions {
  format: "pdf" | "png" | "jpeg";
  quality: number;
  width?: number;
  filename?: string;
  continuous?: boolean; // New option for continuous scroll
}

export class ReportDownloader {
  private static async captureSection(
    sectionElement: HTMLElement
  ): Promise<HTMLCanvasElement> {
    // Check if element has valid dimensions
    const rect = sectionElement.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      console.warn("Section has zero dimensions, skipping:", sectionElement);
      // Create a minimal canvas for empty sections
      const emptyCanvas = document.createElement("canvas");
      emptyCanvas.width = 800;
      emptyCanvas.height = 50;
      const ctx = emptyCanvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, emptyCanvas.width, emptyCanvas.height);
      return emptyCanvas;
    }

    // Store original styles to restore later
    const originalStyles = new Map<HTMLElement, string>();
    const modifiedElements: HTMLElement[] = [];

    // Function to temporarily remove scrolling and expand content
    const prepareElementForCapture = (element: HTMLElement) => {
      originalStyles.set(element, element.style.cssText);
      modifiedElements.push(element);

      // Remove scrolling and ensure full content is visible
      element.style.overflow = "visible";
      element.style.overflowX = "visible";
      element.style.overflowY = "visible";
      element.style.maxHeight = "none";
      element.style.height = "auto";
      element.style.transform = "none";
      element.style.transition = "none";
    };

    try {
      // Prepare main section element
      prepareElementForCapture(sectionElement);

      // Find and prepare all scrollable child elements
      const scrollableElements = sectionElement.querySelectorAll(
        '[style*="overflow"], .overflow-auto, .overflow-scroll, .overflow-y-auto, .overflow-x-auto, .overflow-hidden'
      );

      scrollableElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          prepareElementForCapture(el);
        }
      });

      // Also handle common scrollable containers
      const commonScrollContainers = sectionElement.querySelectorAll(
        '.flex-1, .h-40, .h-64, .h-80, .max-h-40, .max-h-64, .max-h-80, [class*="h-"], [class*="max-h-"]'
      );

      commonScrollContainers.forEach((el) => {
        if (el instanceof HTMLElement) {
          const computedStyle = window.getComputedStyle(el);
          if (
            computedStyle.overflow !== "visible" ||
            computedStyle.overflowY !== "visible" ||
            computedStyle.overflowX !== "visible"
          ) {
            prepareElementForCapture(el);
          }
        }
      });

      // Force layout recalculation
      void sectionElement.offsetHeight;

      // Wait for fonts to load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Wait a bit for layout to settle
      await new Promise((resolve) => setTimeout(resolve, 200));
      const canvas = await html2canvas(sectionElement, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Increased for better quality
        scrollX: 0,
        scrollY: 0,
        width: Math.max(sectionElement.scrollWidth, rect.width),
        height: Math.max(sectionElement.scrollHeight, rect.height),
        backgroundColor: "#ffffff",
        removeContainer: false,
        logging: false,
        imageTimeout: 15000, // Increased timeout
        onclone: (clonedDoc) => {
          // Copy all stylesheets to cloned document
          const originalStyleSheets = document.styleSheets;
          for (let i = 0; i < originalStyleSheets.length; i++) {
            try {
              const styleSheet = originalStyleSheets[i];
              if (styleSheet.href) {
                // External stylesheet
                const linkElement = clonedDoc.createElement("link");
                linkElement.rel = "stylesheet";
                linkElement.href = styleSheet.href;
                clonedDoc.head.appendChild(linkElement);
              } else if (styleSheet.cssRules) {
                // Inline stylesheet
                const styleElement = clonedDoc.createElement("style");
                let cssText = "";
                for (let j = 0; j < styleSheet.cssRules.length; j++) {
                  cssText += styleSheet.cssRules[j].cssText + "\n";
                }
                styleElement.textContent = cssText;
                clonedDoc.head.appendChild(styleElement);
              }
            } catch (e) {
              // Skip if can't access stylesheet due to CORS
              console.warn("Could not copy stylesheet:", e);
            }
          }

          // Ensure cloned document also has scroll elements expanded
          const clonedSection = clonedDoc.querySelector(
            `[data-section-id="${sectionElement.getAttribute(
              "data-section-id"
            )}"]`
          );
          if (clonedSection) {
            const clonedScrollables = clonedSection.querySelectorAll(
              '[style*="overflow"], .overflow-auto, .overflow-scroll, .overflow-y-auto, .overflow-x-auto, .overflow-hidden'
            );

            clonedScrollables.forEach((el) => {
              if (el instanceof HTMLElement) {
                el.style.overflow = "visible";
                el.style.overflowX = "visible";
                el.style.overflowY = "visible";
                el.style.maxHeight = "none";
                el.style.height = "auto";
              }
            });

            // Enhanced inline styles for better compatibility
            const style = clonedDoc.createElement("style");
            style.textContent = `
              @import url('https://fonts.googleapis.com/css2?family=Helvetica:wght@400;500;600;700&display=swap');
              
              * { 
                -webkit-print-color-adjust: exact !important; 
                color-adjust: exact !important; 
                print-color-adjust: exact !important;
                box-sizing: border-box !important;
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
              }
              
              body, html {
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
              }
              
              /* Preserve dangerouslySetInnerHTML content styling */
              [dangerously-set-inner-html] * {
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
                color: inherit !important;
              }
              
              /* Typography with Tailwind class compatibility */
              .text-2xl, h1 { 
                font-size: 24px !important; 
                line-height: 1.3 !important; 
                font-weight: 700 !important; 
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
              }
              .text-xl, h2 { 
                font-size: 20px !important; 
                line-height: 1.4 !important; 
                font-weight: 600 !important; 
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
              }
              .text-lg, h3 { 
                font-size: 18px !important; 
                line-height: 1.4 !important; 
                font-weight: 500 !important; 
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
              }
              .text-base, p { 
                font-size: 16px !important; 
                line-height: 1.5 !important; 
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
              }
              .text-sm { 
                font-size: 14px !important; 
                line-height: 1.6 !important; 
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
              }
              .text-xs { 
                font-size: 12px !important; 
                line-height: 1.6 !important; 
                font-family: 'Helvetica', 'Helvetica Neue', Arial, sans-serif !important;
              }
              
              /* Colors - exact match with Tailwind */
              .text-blue-700 { color: #1d4ed8 !important; }
              .text-blue-600 { color: #2563eb !important; }
              .text-gray-900 { color: #111827 !important; }
              .text-gray-800 { color: #1f2937 !important; }
              .text-gray-700 { color: #374151 !important; }
              .text-gray-600 { color: #4b5563 !important; }
              .text-gray-500 { color: #6b7280 !important; }
              .text-black { color: #000000 !important; }
              
              /* Font weights - exact match with Tailwind */
              .font-bold { font-weight: 700 !important; }
              .font-semibold { font-weight: 600 !important; }
              .font-medium { font-weight: 500 !important; }
              .font-normal { font-weight: 400 !important; }
              
              /* Lists with proper styling */
              ul { 
                list-style-type: disc !important; 
                margin-left: 0 !important; 
                padding-left: 20px !important; 
                list-style-position: outside !important;
              }
              ol { 
                list-style-type: decimal !important; 
                margin-left: 0 !important; 
                padding-left: 20px !important; 
                list-style-position: outside !important;
              }
              li { 
                margin: 8px 0 !important; 
                display: list-item !important; 
                padding-left: 0 !important;
                line-height: 1.6 !important;
                text-align: left !important;
              }
              
              /* Nested lists */
              ul ul, ol ol, ul ol, ol ul {
                margin-left: 0 !important;
                padding-left: 20px !important;
                margin-top: 4px !important;
                margin-bottom: 4px !important;
              }
              
              /* List item content */
              li p {
                margin: 0 !important;
                display: inline !important;
                text-align: left !important;
              }
              
              /* Fix for dangerouslySetInnerHTML lists */
              [dangerously-set-inner-html] ul,
              .prose ul,
              .content ul {
                list-style-type: disc !important;
                margin-left: 0 !important;
                padding-left: 20px !important;
                list-style-position: outside !important;
              }
              
              [dangerously-set-inner-html] ol,
              .prose ol,
              .content ol {
                list-style-type: decimal !important;
                margin-left: 0 !important;
                padding-left: 20px !important;
                list-style-position: outside !important;
              }
              
              [dangerously-set-inner-html] li,
              .prose li,
              .content li {
                display: list-item !important;
                margin: 8px 0 !important;
                padding-left: 0 !important;
                text-align: left !important;
                line-height: 1.6 !important;
              }
              
              /* Specific targeting for insight content */
              .insight-content ul,
              .insight-body ul {
                list-style-type: disc !important;
                margin-left: 0 !important;
                padding-left: 20px !important;
                list-style-position: outside !important;
              }
              
              .insight-content li,
              .insight-body li {
                display: list-item !important;
                margin: 8px 0 !important;
                padding-left: 0 !important;
                text-align: left !important;
              }
              
              /* Background colors - exact match with Tailwind */
              .bg-white { background-color: #ffffff !important; }
              .bg-gray-50 { background-color: #f9fafb !important; }
              .bg-gray-100 { background-color: #f3f4f6 !important; }
              
              /* Borders - exact match with Tailwind */
              .border { border: 1px solid #d1d5db !important; }
              .border-gray-100 { border-color: #f3f4f6 !important; }
              .border-gray-200 { border-color: #e5e7eb !important; }
              .rounded-xl { border-radius: 12px !important; }
              .rounded-lg { border-radius: 8px !important; }
              
              /* Spacing - exact match with Tailwind */
              .p-4 { padding: 16px !important; }
              .p-6 { padding: 24px !important; }
              .mb-3 { margin-bottom: 12px !important; }
              .mb-6 { margin-bottom: 24px !important; }
              .gap-2 { gap: 8px !important; }
              .gap-3 { gap: 12px !important; }
              
              /* Shadows - exact match with Tailwind */
              .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }
              .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; }
              
              /* Flex and Layout - exact match with Tailwind */
              .flex { display: flex !important; }
              .items-center { align-items: center !important; }
              .justify-between { justify-content: space-between !important; }
              .gap-2 { gap: 8px !important; }
              .gap-3 { gap: 12px !important; }
              .gap-8 { gap: 32px !important; }
              .space-y-2 > * + * { margin-top: 8px !important; }
              .space-y-3 > * + * { margin-top: 12px !important; }
              
              /* Grid Layout - Force lg breakpoint styles */
              .lg\\:grid { display: grid !important; }
              .lg\\:grid-cols-5 { grid-template-columns: repeat(5, 1fr) !important; }
              .lg\\:col-span-3 { grid-column: span 3 / span 3 !important; }
              .lg\\:col-span-2 { grid-column: span 2 / span 2 !important; }
              
              /* Override flex-col when grid is active */
              .lg\\:grid.flex-col { flex-direction: row !important; }
              .lg\\:grid.flex { display: grid !important; }
            `;
            clonedDoc.head.appendChild(style);
          }
        },
      });

      // Restore all original styles
      modifiedElements.forEach((el) => {
        const originalStyle = originalStyles.get(el);
        if (originalStyle !== undefined) {
          el.style.cssText = originalStyle;
        }
      });

      return canvas;
    } catch (error) {
      console.error("Error capturing section:", error);

      // Restore all original styles even on error
      modifiedElements.forEach((el) => {
        const originalStyle = originalStyles.get(el);
        if (originalStyle !== undefined) {
          el.style.cssText = originalStyle;
        }
      });

      // Return a fallback canvas
      const fallbackCanvas = document.createElement("canvas");
      fallbackCanvas.width = 800;
      fallbackCanvas.height = 100;
      const ctx = fallbackCanvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, fallbackCanvas.width, fallbackCanvas.height);
      ctx.fillStyle = "#666666";
      ctx.font = "16px Arial";
      ctx.fillText("Error capturing section", 20, 50);
      return fallbackCanvas;
    }
  }

  static async downloadReport(
    reportTitle: string,
    options: DownloadOptions = { format: "pdf", quality: 0.95 }
  ): Promise<void> {
    let loadingDiv: HTMLElement | null = null;

    try {
      // Find all section elements
      const sectionElements = document.querySelectorAll(
        "[data-section-id]"
      ) as NodeListOf<HTMLElement>;

      if (sectionElements.length === 0) {
        throw new Error("No sections found to download");
      }

      // Show loading indicator
      loadingDiv = document.createElement("div");
      loadingDiv.id = "download-loading-overlay";
      loadingDiv.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
          <div style="text-align: center;">
            <div style="margin-bottom: 20px;">📊 Generating Report...</div>
            <div style="width: 300px; height: 6px; background: #333; border-radius: 3px;">
              <div id="download-progress-bar" style="width: 0%; height: 100%; background: #4f46e5; border-radius: 3px; transition: width 0.3s;"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(loadingDiv);

      // Capture each section with positions
      const result = await this.captureSectionsWithPositions(sectionElements);
      const { canvas: combinedCanvas, sections } = result;

      const progressBar = document.getElementById("download-progress-bar");
      if (progressBar) {
        progressBar.style.width = "80%";
      }

      // Generate filename
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename =
        options.filename ||
        `${reportTitle.replace(/[^a-z0-9]/gi, "_")}_${timestamp}`;

      // Download based on format
      if (options.format === "pdf") {
        if (options.continuous) {
          await this.downloadAsPDFContinuous(
            combinedCanvas,
            filename,
            options.quality || 0.95
          );
        } else {
          await this.downloadAsPDFSmart(
            combinedCanvas,
            sections,
            filename,
            options.quality || 0.95
          );
        }
      } else {
        await this.downloadAsImage(
          combinedCanvas,
          filename,
          options.format,
          options.quality || 0.95
        );
      }

      if (progressBar) {
        progressBar.style.width = "100%";
      }

      // Remove loading indicator
      setTimeout(() => {
        if (loadingDiv && loadingDiv.parentNode) {
          document.body.removeChild(loadingDiv);
        }
      }, 500);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Error generating report. Please try again.");

      // Remove loading indicator on error - safe removal
      if (loadingDiv && loadingDiv.parentNode) {
        document.body.removeChild(loadingDiv);
      } else {
        // Fallback: try to find and remove by ID
        const existingOverlay = document.getElementById(
          "download-loading-overlay"
        );
        if (existingOverlay && existingOverlay.parentNode) {
          existingOverlay.parentNode.removeChild(existingOverlay);
        }
      }
    }
  }

  // Capture individual sections and track their positions
  private static async captureSectionsWithPositions(
    sectionElements: NodeListOf<HTMLElement>
  ): Promise<{
    canvas: HTMLCanvasElement;
    sections: Array<{ id: string; startY: number; endY: number }>;
  }> {
    const canvases: HTMLCanvasElement[] = [];
    const sectionPositions: Array<{
      id: string;
      startY: number;
      endY: number;
    }> = [];
    let currentY = 0;

    for (let i = 0; i < sectionElements.length; i++) {
      const section = sectionElements[i];
      const sectionId =
        section.getAttribute("data-section-id") || `section-${i}`;

      // Update progress
      const progressBar = document.getElementById("download-progress-bar");
      if (progressBar) {
        progressBar.style.width = `${(i / sectionElements.length) * 70}%`;
      }

      const canvas = await this.captureSection(section);
      canvases.push(canvas);

      const startY = currentY;
      const endY = currentY + canvas.height;

      sectionPositions.push({
        id: sectionId,
        startY,
        endY,
      });

      currentY = endY + 40; // Add spacing between sections (increased for better separation)

      // Small delay to prevent blocking
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Combine all canvases with tracked positions
    const totalHeight = currentY - 40; // Remove last spacing
    const maxWidth = Math.max(...canvases.map((c) => c.width));

    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = maxWidth;
    combinedCanvas.height = totalHeight;

    const ctx = combinedCanvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);

    currentY = 0;
    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      ctx.drawImage(canvas, 0, currentY);
      currentY += canvas.height + 40; // Match spacing
    }

    return {
      canvas: combinedCanvas,
      sections: sectionPositions,
    };
  }

  // Smart PDF generation that puts each section on its own page (Landscape)
  private static async downloadAsPDFSmart(
    canvas: HTMLCanvasElement,
    sections: Array<{ id: string; startY: number; endY: number }>,
    filename: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _quality: number // Using PNG with 1.0 quality instead
  ): Promise<void> {
    const pdf = new jsPDF("l", "mm", "a4"); // Landscape orientation

    // A4 dimensions in mm (landscape)
    const pageWidth = 297; // Landscape width
    const pageHeight = 210; // Landscape height
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    // Calculate scale to fit each section in a page
    const pixelsPerMM = canvas.width / contentWidth;

    // Process each section as a separate page
    for (let i = 0; i < sections.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      const section = sections[i];
      const sectionHeight = section.endY - section.startY;

      // Create canvas for this section
      const sectionCanvas = document.createElement("canvas");
      sectionCanvas.width = canvas.width;
      sectionCanvas.height = sectionHeight;

      const sectionCtx = sectionCanvas.getContext("2d")!;
      sectionCtx.fillStyle = "#ffffff";
      sectionCtx.fillRect(0, 0, sectionCanvas.width, sectionCanvas.height);

      // Draw this section from the combined canvas
      sectionCtx.drawImage(
        canvas,
        0,
        section.startY,
        canvas.width,
        sectionHeight,
        0,
        0,
        sectionCanvas.width,
        sectionCanvas.height
      );

      // Calculate dimensions to fit the section in the page
      const sectionImgData = sectionCanvas.toDataURL("image/png", 1.0); // Use PNG for better quality
      const scaledHeight = Math.min(contentHeight, sectionHeight / pixelsPerMM);

      // Center the section on the page if it's smaller than the page
      const yPosition = margin + (contentHeight - scaledHeight) / 2;

      pdf.addImage(
        sectionImgData,
        "PNG",
        margin,
        yPosition,
        contentWidth,
        scaledHeight
      );
    }

    pdf.save(`${filename}.pdf`);
  }

  // Continuous PDF generation - no page breaks, single long page (Portrait)
  private static async downloadAsPDFContinuous(
    canvas: HTMLCanvasElement,
    filename: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _quality: number // Using PNG with 1.0 quality instead
  ): Promise<void> {
    // Calculate optimal page width to fit content (Portrait orientation)
    const maxWidthMM = 210; // A4 portrait width
    const margin = 10;
    const contentWidthMM = maxWidthMM - margin * 2;

    // Calculate height based on canvas aspect ratio
    const aspectRatio = canvas.height / canvas.width;
    const contentHeightMM = contentWidthMM * aspectRatio;

    // Create custom PDF with portrait orientation and exact dimensions needed
    const pdf = new jsPDF("p", "mm", [
      maxWidthMM,
      contentHeightMM + margin * 2,
    ]);

    // Convert canvas to image and add to PDF
    const imgData = canvas.toDataURL("image/png", 1.0); // Use PNG for better quality

    pdf.addImage(
      imgData,
      "PNG",
      margin, // x position
      margin, // y position
      contentWidthMM, // width
      contentHeightMM // height
    );

    pdf.save(`${filename}_continuous.pdf`);
  }

  private static async downloadAsImage(
    canvas: HTMLCanvasElement,
    filename: string,
    format: "png" | "jpeg",
    quality: number
  ): Promise<void> {
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const dataURL = canvas.toDataURL(mimeType, quality);

    const link = document.createElement("a");
    link.download = `${filename}.${format}`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
