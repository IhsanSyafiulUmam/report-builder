import React from "react";
import TextEditor from "../TextEditor";
import ActionTitle from "../shared/ActionTitle";

interface OverviewSectionProps {
  section: {
    id: string;
    title: string;
    content: {
      text: string;
      actionTitle?: string;
      subheadline?: string;
    };
  };
  onUpdate: (updates: {
    content: {
      text?: string;
      actionTitle?: string;
      subheadline?: string;
    };
  }) => void;
  isEditable?: boolean;
}

const OverviewSection: React.FC<OverviewSectionProps> = ({
  section,
  onUpdate,
  isEditable = false,
}) => {
  const updateContent = (field: string, value: string) => {
    onUpdate({
      content: {
        ...section.content,
        [field]: value,
      },
    });
  };

  const handleActionTitleChange = (newTitle: string) => {
    onUpdate({ content: { ...section.content, actionTitle: newTitle } });
  };

  const handleSubheadlineChange = (newSubheadline: string) => {
    onUpdate({ content: { ...section.content, subheadline: newSubheadline } });
  };

  return (
    <div className="p-6">
      {/* Action Title */}
      <div className="mb-8 group">
        <ActionTitle
          title={section.content.actionTitle || "Executive Summary"}
          subheadline={
            section.content.subheadline ||
            "Provide a high-level overview of key findings and strategic insights."
          }
          isEditable={isEditable}
          onEditTitle={handleActionTitleChange}
          onEditSubheadline={handleSubheadlineChange}
        />
      </div>

      <TextEditor
        value={section.content.text}
        onChange={(value) => updateContent("text", value)}
        placeholder="Add your executive summary and key insights here. Include main findings, strategic recommendations, and important highlights that stakeholders need to know..."
      />

      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          💡 Tips for Executive Summary
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Keep it concise and focused on key outcomes</li>
          <li>• Include quantifiable results and metrics</li>
          <li>• Highlight actionable recommendations</li>
          <li>• Structure with clear headings and bullet points</li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewSection;
