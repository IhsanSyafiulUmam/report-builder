import React, { useState } from "react";
import { ChevronRight, Copy, Database, Eye } from "lucide-react";

export interface QueryItem {
  id: string;
  query: string;
}

interface QueryEditorProps {
  queries: QueryItem[];
  isEditable: boolean;
  onChange: (queries: QueryItem[]) => void;
  title?: string;
}

const QueryEditor: React.FC<QueryEditorProps> = ({
  queries,
  isEditable,
  onChange,
  title = "SQL Query",
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleQueryChange = (idx: number, value: string) => {
    const newQueries = queries.map((q, i) =>
      i === idx ? { ...q, query: value } : q
    );
    onChange(newQueries);
  };

  const handleCopy = async (query: string, id: string) => {
    try {
      await navigator.clipboard.writeText(query);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isEditable || queries.length === 0) return null;

  return (
    <div className="mb-4 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 transition-colors duration-200 border-b border-gray-200 cursor-pointer select-none bg-gray-50 hover:bg-gray-100"
        onClick={() => setCollapsed((c) => !c)}
      >
        <div className="flex items-center space-x-3">
          <div className="p-1 bg-blue-100 rounded">
            <Database className="w-4 h-4 text-blue-600" />
          </div>
          <h4 className="text-sm font-medium text-gray-900">
            {title}
          </h4>
          <div className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded">
            {queries.length} {queries.length === 1 ? 'query' : 'queries'}
          </div>
        </div>
        
        <button
          type="button"
          className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-gray-600 transition-colors duration-200 bg-white border border-gray-300 rounded hover:bg-gray-50"
          tabIndex={-1}
        >
          <Eye className="w-3 h-3" />
          <span>{collapsed ? 'Show' : 'Hide'}</span>
          <ChevronRight className={`w-3 h-3 transition-transform duration-200 ${!collapsed ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-4">
          <div className="space-y-4">
            {queries.map((q, idx) => (
              <div
                key={q.id}
                className="overflow-hidden border border-gray-200 rounded-md"
              >
                {/* Query Header */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
                  <span className="text-xs font-medium text-gray-600">
                    Query {q.id || idx + 1}
                  </span>
                  
                  <button
                    type="button"
                    className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors duration-200 ${
                      copiedId === q.id
                        ? 'text-green-700 bg-green-50'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    onClick={() => handleCopy(q.query, q.id)}
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedId === q.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                {/* Query Content */}
                <div className="p-3">
                  <textarea
                    value={q.query}
                    onChange={(e) => handleQueryChange(idx, e.target.value)}
                    className="w-full p-3 font-mono text-sm border border-gray-200 rounded bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    rows={Math.max(4, q.query.split("\n").length)}
                    spellCheck={false}
                    style={{ resize: "vertical" }}
                    placeholder="Enter your SQL query here..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryEditor;