import React from "react";

interface ReportFooterProps {
  source?: string;
  period?: string;
  channels?: string;
  logoColor?: string;
  companyName?: string;
}

const ReportFooter: React.FC<ReportFooterProps> = ({
  source = "Markethac Data",
  period = "Sep 2024 - Feb 2025",
  channels = "Shopee, TikTok, Tokopedia",
}) => {
  return (
    <div className="flex items-center justify-between pt-6 mt-5 text-sm text-gray-500 border-t">
      <div>
        <p>
          <span className="font-medium">Sumber:</span> {source}
        </p>
        <p>
          <span className="font-medium">Periode:</span> {period}
        </p>
        <p>
          <span className="font-medium">Channel:</span> {channels}
        </p>
      </div>
          <img
            src="/images/logo.svg"
            alt="markethac logo"
            className="object-contain h-30 w-30"
          />
    </div>
  );
};

export default ReportFooter;
