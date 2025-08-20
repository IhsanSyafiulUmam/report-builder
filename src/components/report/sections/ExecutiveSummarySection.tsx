import React, { useState, useRef, useEffect } from "react";
import { ActionTitle } from "../shared";
import {
  Bold,
  Italic,
  Type,
  Palette,
  ChevronDown,
  Edit,
  Check,
  X,
  List,
  ListOrdered,
} from "lucide-react";

interface ExecutiveSummarySectionProps {
  section: {
    id: string;
    title: string;
    content: {
      actionTitle?: string;
      subheadline?: string;
      summary?: string;
      text?: string;
      insights?: Array<{ text: string }>;
    };
  };
  onUpdate: (updates: Partial<ExecutiveSummarySectionProps["section"]>) => void;
  isEditable: boolean;
}

export const ExecutiveSummarySection: React.FC<
  ExecutiveSummarySectionProps
> = ({ section, onUpdate, isEditable }) => {
  const content = section.content || {};
  const [isEditingText, setIsEditingText] = useState(false);
  const [tempText, setTempText] = useState(content.text || "");
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);
  
  const textRef = useRef<HTMLDivElement>(null);

  // Color palette for text styling
  const colors = [
    { name: "Blue", value: "#2563eb", class: "text-blue-600" },
    { name: "Green", value: "#16a34a", class: "text-green-600" },
    { name: "Red", value: "#dc2626", class: "text-red-600" },
    { name: "Purple", value: "#9333ea", class: "text-purple-600" },
    { name: "Orange", value: "#ea580c", class: "text-orange-600" },
    { name: "Gray", value: "#4b5563", class: "text-gray-600" },
    { name: "Black", value: "#000000", class: "text-black" },
  ];

  // Font size options
  const fontSizes = [
    { name: "Heading 1", tag: "h1", class: "text-3xl font-bold" },
    { name: "Heading 2", tag: "h2", class: "text-2xl font-bold" },
    { name: "Heading 3", tag: "h3", class: "text-xl font-semibold" },
    { name: "Heading 4", tag: "h4", class: "text-lg font-semibold" },
    { name: "Paragraph", tag: "p", class: "text-base font-normal" },
  ];

  useEffect(() => {
    setTempText(content.text || "");
  }, [content.text]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFontSizeDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest(".font-size-dropdown")) {
          setShowFontSizeDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFontSizeDropdown]);

  const handleActionTitleChange = (title: string) => {
    onUpdate({
      content: {
        ...content,
        actionTitle: title,
      },
    });
  };

  const handleSubheadlineChange = (subheadline: string) => {
    onUpdate({
      content: {
        ...content,
        subheadline: subheadline,
      },
    });
  };

  const handleTextChange = (text: string) => {
    onUpdate({
      content: {
        ...content,
        text: text,
      },
    });
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const applyColor = (color: string) => {
    document.execCommand("foreColor", false, color);
  };

  const applyList = (listType: "unordered" | "ordered") => {
    if (listType === "unordered") {
      document.execCommand("insertUnorderedList", false);
    } else {
      document.execCommand("insertOrderedList", false);
    }
  };

  const applyFontSize = (sizeClass: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (range.toString()) {
        const span = document.createElement("span");
        span.className = sizeClass;
        try {
          range.surroundContents(span);
        } catch {
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
        selection.removeAllRanges();
      }
    }
    setShowFontSizeDropdown(false);
  };

  const handleSaveText = () => {
    if (textRef.current) {
      const htmlContent = textRef.current.innerHTML;
      handleTextChange(htmlContent);
    }
    setIsEditingText(false);
  };

  const handleCancelText = () => {
    if (textRef.current) {
      textRef.current.innerHTML = tempText;
    }
    setIsEditingText(false);
  };

  const startEditingText = () => {
    setIsEditingText(true);
    setTimeout(() => {
      if (textRef.current) {
        textRef.current.focus();
      }
    }, 0);
  };

  const defaultText = `Our business performance for this period demonstrates strong growth across all key metrics. Revenue increased significantly driven by improved customer acquisition and retention strategies. The strategic initiatives implemented during this quarter have yielded substantial results, positioning us well for continued success.

Key Highlights:
• Revenue Growth: 12.5% increase compared to last month, reaching Rp 245.8B
• Customer Base: Active customer count grew to 1.2M with 5.2% new customer acquisition  
• Market Expansion: Successfully entered 3 new market segments
• Operational Efficiency: 8% improvement in cost optimization

Strategic Recommendations:
• Continue investment in customer acquisition channels
• Expand product portfolio in high-performing categories
• Strengthen partnerships with key resellers
• Focus on digital transformation initiatives

This executive summary reflects our commitment to data-driven decision making and strategic growth. The positive trends across all metrics indicate strong market positioning and effective execution of our business strategy.`;

  return (
    <div className="p-6">
      {/* Action Title */}
      <div className="mb-6 group">
        <ActionTitle
          title={content.actionTitle || "Executive Summary"}
          subheadline={
            content.subheadline ||
            "Key business insights and performance overview"
          }
          isEditable={isEditable}
          onEditTitle={handleActionTitleChange}
          onEditSubheadline={handleSubheadlineChange}
        />
      </div>

      {/* Rich Text Toolbar */}
      {isEditingText && (
        <div className="flex items-center gap-2 p-3 mb-4 border rounded-lg shadow-sm bg-gray-50">
          {/* Font Size Dropdown */}
          <div className="relative font-size-dropdown">
            <button
              onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span>Font Size</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  showFontSizeDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showFontSizeDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] py-1">
                {fontSizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => applyFontSize(size.class)}
                    className="flex items-center w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                  >
                    <span className={`${size.class} group-hover:text-blue-700`}>
                      {size.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => applyFormat("bold")}
              className="p-2 text-gray-700 transition-colors rounded hover:bg-gray-200"
              title="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => applyFormat("italic")}
              className="p-2 text-gray-700 transition-colors rounded hover:bg-gray-200"
              title="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              onClick={() => applyFormat("underline")}
              className="p-2 text-gray-700 transition-colors rounded hover:bg-gray-200"
              title="Underline"
            >
              <Type size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          <div className="flex items-center gap-1">
            <button
              onClick={() => applyList("unordered")}
              className="p-2 text-gray-700 transition-colors rounded hover:bg-gray-200"
              title="Bullet List"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => applyList("ordered")}
              className="p-2 text-gray-700 transition-colors rounded hover:bg-gray-200"
              title="Numbered List"
            >
              <ListOrdered size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          <div className="flex items-center gap-1">
            <Palette size={16} className="text-gray-500" />
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => applyColor(color.value)}
                className="w-6 h-6 transition-transform border border-gray-300 rounded hover:scale-110"
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveText}
              className="px-3 py-2 text-sm text-white transition-colors bg-green-600 rounded hover:bg-green-700"
            >
              <Check size={16} className="inline mr-1" />
              Save
            </button>
            <button
              onClick={handleCancelText}
              className="px-3 py-2 text-sm text-gray-700 transition-colors bg-gray-200 rounded hover:bg-gray-300"
            >
              <X size={16} className="inline mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Executive Summary Content */}
      {isEditable ? (
        // Builder Mode - Editable with Rich Text Editor
        <div className="space-y-6">
          {isEditingText ? (
            <div
              ref={textRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="p-4 text-base leading-relaxed text-gray-800 bg-white border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none min-h-[400px]"
              style={{
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#1f2937",
                minHeight: "400px",
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  handleCancelText();
                }
              }}
              dangerouslySetInnerHTML={{ __html: content.text || defaultText }}
            />
          ) : (
            <div className="relative group">
              <div 
                className="p-4 text-base leading-relaxed text-gray-800 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 min-h-[400px]"
                onClick={startEditingText}
                dangerouslySetInnerHTML={{ 
                  __html: (content.text || defaultText).replace(/\n/g, '<br />') 
                }}
              />
              <button
                onClick={startEditingText}
                className="absolute p-2 text-gray-400 transition-opacity rounded opacity-0 top-2 right-2 hover:text-blue-600 hover:bg-blue-50 group-hover:opacity-100"
              >
                <Edit size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        // Viewer Mode - Three Column Layout
        <div 
          className="leading-relaxed prose text-justify prose-gray max-w-none"
          style={{
            columnCount: 3,
            columnGap: '2rem',
            columnFill: 'balance',
            columnRuleWidth: '1px',
            columnRuleStyle: 'solid',
            columnRuleColor: '#e5e7eb'
          }}
        >
          <div 
            dangerouslySetInnerHTML={{ 
              __html: (content.text || defaultText).replace(/\n/g, '<br />') 
            }}
          />
        </div>
      )}
    </div>
  );
};
