import React, { useState } from "react";
import { Download, Filter } from "lucide-react";
import { ResizableWrapper } from "./shared";

interface TableData {
  [key: string]: string | number | React.ReactNode;
}

interface TableColumn {
  key: string;
  label: string;
  type?: "text" | "number" | "currency" | "percentage" | "link";
  formatter?: (value: unknown, row?: TableData) => string | React.ReactNode;
}

interface TableConfig {
  type: "basic" | "reseller" | "categories" | "performance";
  data: TableData[];
  columns?: TableColumn[];
  title?: string;
  width?: number;
  height?: number;
  showHeader?: boolean;
  showFooter?: boolean;
  striped?: boolean;
  compact?: boolean;
}

interface TableComponentProps {
  config: TableConfig;
  onChange?: (config: Partial<TableConfig>) => void;
  isEditable?: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({
  config,
  onChange,
  isEditable = false,
}) => {
  const [tableTitle, setTableTitle] = useState(config.title || "Data Table");

  const updateConfig = (updates: Partial<TableConfig>) => {
    if (onChange) {
      const newConfig = {
        ...config,
        title: tableTitle,
        width: config.width || 600,
        height: config.height || 400,
        ...updates,
      };
      onChange(newConfig);
    }
  };

  const handleResize = (width: number, height: number) => {
    updateConfig({ width, height });
  };

  const getColumns = (): TableColumn[] => {
    if (config.columns) {
      return config.columns;
    }

    // Auto-generate columns from data
    if (config.data && config.data.length > 0) {
      return Object.keys(config.data[0]).map((key) => ({
        key,
        label:
          key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        type: "text",
      }));
    }

    return [];
  };

  const formatCellValue = (
    value: unknown,
    column: TableColumn,
    row: TableData
  ): React.ReactNode => {
    if (column.formatter) {
      return column.formatter(value, row);
    }

    switch (column.type) {
      case "currency":
        return typeof value === "string" && value.includes("$")
          ? value
          : `$${value}`;
      case "percentage":
        return typeof value === "string" && value.includes("%")
          ? value
          : `${value}%`;
      case "number":
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);
      case "link":
        return (
          <a
            href={String(value)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate block max-w-[200px]"
          >
            {String(value)}
          </a>
        );
      default:
        return String(value);
    }
  };

  const columns = getColumns();

  const tableContent = (
    <div className="space-y-4">
      {/* Table Configuration */}
      {isEditable && (
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Table Title
            </label>
            <input
              type="text"
              value={tableTitle}
              onChange={(e) => {
                setTableTitle(e.target.value);
                updateConfig({ title: e.target.value });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center ml-4 space-x-2">
            <button className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600">
              <Filter size={18} />
            </button>
            <button className="p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600">
              <Download size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Table Preview */}
      <div
        className="overflow-hidden bg-white border border-gray-200 rounded-lg"
        style={{ height: isEditable ? "auto" : config.height || 400 }}
      >
        {config.showHeader !== false && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-medium text-gray-900">
              {config.title || tableTitle}
            </h3>
          </div>
        )}
        <div
          className="overflow-auto"
          style={{ maxHeight: isEditable ? 400 : "100%" }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase ${
                      config.compact ? "px-3 py-2" : "px-6 py-3"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody
              className={`bg-white divide-y divide-gray-200 ${
                config.striped ? "divide-y-0" : ""
              }`}
            >
              {config.data.map((row, index) => (
                <tr
                  key={index}
                  className={`hover:bg-gray-50 ${
                    config.striped && index % 2 === 1 ? "bg-gray-50" : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`text-sm text-gray-900 whitespace-nowrap ${
                        config.compact ? "px-3 py-2" : "px-6 py-4"
                      }`}
                    >
                      {formatCellValue(row[column.key], column, row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source Info */}
      {isEditable && (
        <div className="p-4 rounded-lg bg-emerald-50">
          <h4 className="mb-2 text-sm font-medium text-emerald-900">
            Data Source
          </h4>
          <p className="text-sm text-emerald-700">
            Connected to BigQuery/ClickHouse • {config.data.length} rows • Last
            sync: 1 hour ago
          </p>
          <button className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-800">
            Configure data source →
          </button>
        </div>
      )}
    </div>
  );

  if (isEditable && onChange) {
    return (
      <ResizableWrapper
        initialWidth={config.width || 600}
        initialHeight={config.height || 400}
        minWidth={400}
        minHeight={300}
        maxWidth={1200}
        maxHeight={800}
        isEditable={isEditable}
        onResize={handleResize}
        className="mb-4"
      >
        {tableContent}
      </ResizableWrapper>
    );
  }

  return tableContent;
};

export default TableComponent;
