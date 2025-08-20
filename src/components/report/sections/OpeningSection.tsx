import React from "react";

interface OpeningSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
    };
  };
  onUpdate: (updates: { content: { text: string } }) => void;
  client?: string;
  period?: string;
}

function formatPeriod(period?: string): string {
  if (!period) return "July 2025";
  const [year, month] = period.split("-");
  if (!year || !month) return period;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

const OpeningSection: React.FC<OpeningSectionProps> = ({
  client,
  period,
  section,
  onUpdate,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-center bg-cover"
        style={{
          backgroundImage: `url('/images/reports/cover-report.jpg')`,
          zIndex: 0,
        }}
      />

      <div className="relative z-10 flex flex-col items-start justify-center h-full px-8">
        <div
          className="flex flex-col max-w-3xl px-16 py-8 ml-12 border shadow-2xl backdrop-blur-md bg-white/10 border-white/20 rounded-2xl"
          style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)" }}
        >
          <h1 className="mb-3 text-4xl font-light tracking-tight text-left text-white drop-shadow-lg">
            Insight Report
          </h1>
          <div className="w-16 h-0.5 mb-4 rounded-full bg-gradient-to-r from-white/60 via-white to-white/60 opacity-80" />
          <p className="mb-2 text-3xl italic font-semibold tracking-wide text-left text-white/90">
            {client || "Client Name"}
          </p>
          <p className="mt-4 text-xl font-medium tracking-widest text-left text-white/70">
            {formatPeriod(period)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OpeningSection;
