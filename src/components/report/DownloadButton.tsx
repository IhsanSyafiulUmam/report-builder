import React, { useState } from "react";
import { Download, FileText, Image, Camera, Scroll } from "lucide-react";
import { ReportDownloader, DownloadOptions } from "../../lib/reportDownloader";

interface DownloadButtonProps {
  reportTitle: string;
  className?: string;
  variant?: "button" | "dropdown";
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  reportTitle,
  className = "",
  variant = "dropdown",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (options: DownloadOptions) => {
    setIsDownloading(true);
    setIsOpen(false);

    try {
      await ReportDownloader.downloadReport(reportTitle, options);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        onClick={() =>
          handleDownload({ format: "pdf", quality: 0.95, continuous: true })
        }
        disabled={isDownloading}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors ${className}`}
      >
        {isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
            Generating...
          </>
        ) : (
          <>
            <Download size={16} />
            Download PDF
          </>
        )}
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading}
        className="inline-flex items-center gap-2 px-4 py-2 transition-colors bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50"
      >
        {isDownloading ? (
          <>
            <div className="w-4 h-4 border-2 border-gray-400 rounded-full border-t-transparent animate-spin"></div>
            Generating...
          </>
        ) : (
          <>
            <Download size={16} />
            Download
          </>
        )}
      </button>

      {isOpen && !isDownloading && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 z-20 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="py-1">
              <button
                onClick={() =>
                  handleDownload({
                    format: "pdf",
                    quality: 0.95,
                    continuous: false,
                  })
                }
                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FileText size={16} className="text-red-500" />
                PDF (Multi-page)
              </button>
              <button
                onClick={() =>
                  handleDownload({
                    format: "pdf",
                    quality: 0.95,
                    continuous: true,
                  })
                }
                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Scroll size={16} className="text-purple-500" />
                PDF (Continuous)
              </button>
              <button
                onClick={() => handleDownload({ format: "png", quality: 0.95 })}
                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Image size={16} className="text-blue-500" />
                Download as PNG
              </button>
              <button
                onClick={() => handleDownload({ format: "jpeg", quality: 0.9 })}
                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Camera size={16} className="text-green-500" />
                Download as JPEG
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadButton;
