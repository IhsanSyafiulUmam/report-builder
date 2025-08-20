import React from "react";
import { InsightCard, ResizableWrapper } from "./index";

interface InsightManagerProps {
  insights?: Array<{ title: string; body: string }>;
  isEditable?: boolean;
  onAddInsight?: () => void;
  onEditInsight?: (idx: number, field: "title" | "body", value: string) => void;
  onDeleteInsight?: (idx: number) => void;
  className?: string;
  width?: number;
  height?: number;
  onResize?: (width: number, height: number) => void;
}

const InsightManager: React.FC<InsightManagerProps> = ({
  insights = [],
  isEditable = false,
  onAddInsight,
  onEditInsight,
  onDeleteInsight,
  className = "flex flex-col h-full space-y-3",
  width = 400,
  height = 300,
  onResize,
}) => {
  const content = (
    <div className={className}>
      <div className="flex-1 space-y-3 overflow-auto">
        {insights.map((insight, idx) => (
          <InsightCard
            key={idx}
            title={insight.title}
            body={insight.body}
            isEditable={isEditable}
            onEditTitle={(val) => onEditInsight?.(idx, "title", val)}
            onEditBody={(val) => onEditInsight?.(idx, "body", val)}
            showDelete={isEditable}
            onDelete={() => onDeleteInsight?.(idx)}
          />
        ))}
      </div>
      {isEditable && (
        <button
          className="flex-shrink-0 px-3 py-2 mt-2 text-xs text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          onClick={onAddInsight}
        >
          + Tambah Insight
        </button>
      )}
    </div>
  );

  if (isEditable && onResize) {
    return (
      <ResizableWrapper
        initialWidth={width}
        initialHeight={height}
        minWidth={300}
        minHeight={200}
        maxWidth={800}
        maxHeight={600}
        isEditable={isEditable}
        onResize={onResize}
        className="mb-4"
      >
        {content}
      </ResizableWrapper>
    );
  }

  return content;
};

export default InsightManager;
