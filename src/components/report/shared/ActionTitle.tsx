import { useState, useRef, useEffect } from "react";
import {
  Edit,
  Check,
  X,
  Bold,
  Italic,
  Type,
  Palette,
  ChevronDown,
  List,
  ListOrdered,
} from "lucide-react";

interface ActionTitleProps {
  title: string;
  subheadline?: string;
  isEditable?: boolean;
  onEditTitle?: (newTitle: string) => void;
  onEditSubheadline?: (newSubheadline: string) => void;
  className?: string;
}

const ActionTitle: React.FC<ActionTitleProps> = ({
  title,
  subheadline,
  isEditable = false,
  onEditTitle,
  onEditSubheadline,
  className = "",
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingSubheadline, setIsEditingSubheadline] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tempSubheadline, setTempSubheadline] = useState(subheadline || "");
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);

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
    setTempTitle(title);
  }, [title]);

  useEffect(() => {
    setTempSubheadline(subheadline || "");
  }, [subheadline]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFontSizeDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest(".relative")) {
          setShowFontSizeDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFontSizeDropdown]);

  const handleSaveTitle = () => {
    if (onEditTitle && titleRef.current) {
      const htmlContent = titleRef.current.innerHTML;
      onEditTitle(htmlContent);
    }
    setIsEditingTitle(false);
  };

  const handleCancelTitle = () => {
    if (titleRef.current) {
      titleRef.current.innerHTML = tempTitle;
    }
    setIsEditingTitle(false);
  };

  const handleSaveSubheadline = () => {
    if (onEditSubheadline && subheadlineRef.current) {
      const htmlContent = subheadlineRef.current.innerHTML;
      onEditSubheadline(htmlContent);
    }
    setIsEditingSubheadline(false);
  };

  const handleCancelSubheadline = () => {
    if (subheadlineRef.current) {
      subheadlineRef.current.innerHTML = tempSubheadline;
    }
    setIsEditingSubheadline(false);
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
        // If text is selected, wrap it in a span with the font size class
        const span = document.createElement("span");
        span.className = sizeClass;
        try {
          range.surroundContents(span);
        } catch {
          // If surroundContents fails, extract contents and wrap them
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
        selection.removeAllRanges();
      }
    }
    setShowFontSizeDropdown(false);
  };

  const startEditingTitle = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }, 0);
  };

  const startEditingSubheadline = () => {
    setIsEditingSubheadline(true);
    setTimeout(() => {
      if (subheadlineRef.current) {
        subheadlineRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Rich Text Toolbar */}
      {(isEditingTitle || isEditingSubheadline) && (
        <div className="flex items-center gap-2 p-3 border rounded-lg shadow-sm bg-gray-50">
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
        </div>
      )}

      {/* Action Title */}
      <div className="flex items-center gap-3">
        {isEditingTitle ? (
          <div className="flex items-center flex-1 gap-2">
            <div
              ref={titleRef}
              contentEditable
              suppressContentEditableWarning={true}
              className="text-2xl font-bold text-blue-700 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none flex-1 min-h-[2rem]"
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1d4ed8",
                backgroundColor: "transparent",
                borderBottom: "2px solid #93c5fd",
                minHeight: "2rem",
                lineHeight: "1.3",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveTitle();
                }
                if (e.key === "Escape") {
                  handleCancelTitle();
                }
              }}
              dangerouslySetInnerHTML={{ __html: tempTitle }}
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 text-green-600 rounded hover:bg-green-50"
            >
              <Check size={16} />
            </button>
            <button
              onClick={handleCancelTitle}
              className="p-1 text-red-600 rounded hover:bg-red-50"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center flex-1 gap-2">
            <h1
              className="text-2xl font-bold text-blue-700"
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1d4ed8",
                lineHeight: "1.3",
              }}
              dangerouslySetInnerHTML={{ __html: title }}
            />
            {isEditable && onEditTitle && (
              <button
                onClick={startEditingTitle}
                className="p-1 text-gray-400 transition-opacity rounded opacity-0 hover:text-blue-600 hover:bg-blue-50 group-hover:opacity-100"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Subheadline */}
      {(subheadline || isEditable) && (
        <div className="flex items-center gap-3">
          {isEditingSubheadline ? (
            <div className="flex items-center flex-1 gap-2">
              <div
                ref={subheadlineRef}
                contentEditable
                suppressContentEditableWarning={true}
                className="text-lg font-medium text-blue-600 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none flex-1 min-h-[1.5rem]"
                style={{
                  fontSize: "18px",
                  fontWeight: "500",
                  color: "#2563eb",
                  backgroundColor: "transparent",
                  borderBottom: "2px solid #93c5fd",
                  minHeight: "1.5rem",
                  lineHeight: "1.4",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSaveSubheadline();
                  }
                  if (e.key === "Escape") {
                    handleCancelSubheadline();
                  }
                }}
                dangerouslySetInnerHTML={{
                  __html:
                    tempSubheadline ||
                    '<span class="text-gray-400">Add subheadline...</span>',
                }}
              />
              <button
                onClick={handleSaveSubheadline}
                className="p-1 text-green-600 rounded hover:bg-green-50"
              >
                <Check size={16} />
              </button>
              <button
                onClick={handleCancelSubheadline}
                className="p-1 text-red-600 rounded hover:bg-red-50"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center flex-1 gap-2">
              {subheadline ? (
                <h2
                  className="text-lg font-medium text-blue-600"
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    color: "#2563eb",
                    lineHeight: "1.4",
                  }}
                  dangerouslySetInnerHTML={{ __html: subheadline }}
                />
              ) : isEditable && onEditSubheadline ? (
                <button
                  onClick={startEditingSubheadline}
                  className="text-lg font-medium text-gray-400 transition-colors hover:text-blue-600"
                >
                  + Add subheadline
                </button>
              ) : null}
              {isEditable && onEditSubheadline && subheadline && (
                <button
                  onClick={startEditingSubheadline}
                  className="p-1 text-gray-400 transition-opacity rounded opacity-0 hover:text-blue-600 hover:bg-blue-50 group-hover:opacity-100"
                >
                  <Edit size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionTitle;
