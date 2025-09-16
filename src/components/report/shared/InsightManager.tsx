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
  className = "flex flex-col h-full",
  width = 400,
  height = 300,
  onResize,
}) => {
  const content = (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-gray-200">
        {isEditable && (
          <button
            className="px-2 py-1 text-xs text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            onClick={onAddInsight}
          >
            + Add
          </button>
        )}
      </div>
      
      {/* Scrollable Content Area */}
      <div 
        className="flex-1 pr-2 space-y-2 overflow-x-hidden overflow-y-auto"
        style={{
          maxHeight: '400px', // Ensure it fits within slide dimensions
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent'
        }}
      >
        {insights.length > 0 ? (
          insights.map((insight, idx) => (
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
          ))
        ) : (
          <div className="py-6 text-center text-gray-500">
            <div className="text-sm">No insights yet</div>
            {isEditable && (
              <div className="mt-1 text-xs">Click "+ Add" to create your first insight</div>
            )}
          </div>
        )}
      </div>
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
