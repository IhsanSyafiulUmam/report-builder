import React, { useState } from "react";
import { Database, Calendar, Radio, Edit3, Check, X } from "lucide-react";

interface FooterInfo {
  dataSource?: string;
  period?: string;
  channel?: string;
}

interface EditableFooterProps {
  footer?: FooterInfo;
  onUpdate?: (footer: FooterInfo) => void;
  isEditable?: boolean;
}

const EditableFooter: React.FC<EditableFooterProps> = ({
  footer = {},
  onUpdate,
  isEditable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<FooterInfo>(footer);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editValues);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues(footer);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setEditValues(footer);
    setIsEditing(true);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between pt-4 mt-4 text-sm text-gray-500 border-t border-gray-200">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-gray-400" />
            <span>{footer.dataSource || "Data Source"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span>{footer.period || "Period"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-gray-400" />
            <span>{footer.channel || "All Channels"}</span>
          </div>
        </div>
        
        {isEditable && (
          <button
            onClick={handleEdit}
            className="p-1 text-gray-400 transition-colors hover:text-gray-600"
            title="Edit footer info"
          >
            <Edit3 size={14} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="pt-4 mt-4 border-t border-gray-200">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Database size={14} className="text-gray-400" />
          <input
            type="text"
            value={editValues.dataSource || ""}
            onChange={(e) => setEditValues(prev => ({ ...prev, dataSource: e.target.value }))}
            placeholder="Data Source (e.g., BigQuery, Internal DB)"
            className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <input
            type="text"
            value={editValues.period || ""}
            onChange={(e) => setEditValues(prev => ({ ...prev, period: e.target.value }))}
            placeholder="Period (e.g., Jan 2024 - Dec 2024)"
            className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-gray-400" />
          <input
            type="text"
            value={editValues.channel || ""}
            onChange={(e) => setEditValues(prev => ({ ...prev, channel: e.target.value }))}
            placeholder="Channel (e.g., All Channels, Online, Offline)"
            className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 px-2 py-1 text-sm text-gray-600 transition-colors hover:text-gray-800"
          >
            <X size={12} />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 transition-colors hover:text-blue-800"
          >
            <Check size={12} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditableFooter;
