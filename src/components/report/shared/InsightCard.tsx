import { useState, useRef, useEffect } from "react";
import {
  Trash2,
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

const InsightCard = ({
  title,
  body,
  isEditable,
  onEditTitle,
  onEditBody,
  onDelete,
  showDelete,
  error,
}: {
  title: string;
  body: string;
  isEditable?: boolean;
  onEditTitle?: (val: string) => void;
  onEditBody?: (val: string) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  error?: string;
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBody, setIsEditingBody] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const [tempBody, setTempBody] = useState(body);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);

  const titleRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

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
    setTempBody(body);
  }, [body]);

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

  const handleSaveBody = () => {
    if (onEditBody && bodyRef.current) {
      const htmlContent = bodyRef.current.innerHTML;
      onEditBody(htmlContent);
    }
    setIsEditingBody(false);
  };

  const handleCancelBody = () => {
    if (bodyRef.current) {
      bodyRef.current.innerHTML = tempBody;
    }
    setIsEditingBody(false);
  };

  const startEditingTitle = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }, 0);
  };

  const startEditingBody = () => {
    setIsEditingBody(true);
    setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="relative group">
      {/* Rich Text Toolbar */}
      {(isEditingTitle || isEditingBody) && (
        <div className="flex items-center gap-2 p-2 mb-2 border rounded-lg shadow-sm bg-gray-50">
          {/* Font Size Dropdown */}
          <div className="relative font-size-dropdown">
            <button
              onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <span>Size</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${
                  showFontSizeDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showFontSizeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
                {fontSizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => applyFontSize(size.class)}
                    className="flex items-center w-full px-3 py-2 text-xs text-left transition-colors hover:bg-blue-50 hover:text-blue-700 group"
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

      <div className="p-4 bg-white border border-gray-100 shadow-sm rounded-xl">
        {/* Title Section */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {isEditingTitle ? (
            <div className="flex items-center flex-1 gap-2">
              <div
                ref={titleRef}
                contentEditable
                suppressContentEditableWarning={true}
                className="text-sm font-semibold text-gray-800 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none flex-1 min-h-[1.2rem]"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#1f2937",
                  backgroundColor: "transparent",
                  borderBottom: "2px solid #93c5fd",
                  minHeight: "1.2rem",
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
                <Check size={14} />
              </button>
              <button
                onClick={handleCancelTitle}
                className="p-1 text-red-600 rounded hover:bg-red-50"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h3
                className="text-sm font-semibold leading-relaxed text-gray-800"
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  lineHeight: "1.6",
                  color: "#1f2937",
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

        {/* Body Section */}
        <div className="space-y-2">
          {isEditingBody ? (
            <div className="flex items-start gap-2">
              <div
                ref={bodyRef}
                contentEditable
                suppressContentEditableWarning={true}
                className="text-xs text-gray-600 bg-transparent border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none flex-1 min-h-[3rem] max-h-32 overflow-y-auto leading-relaxed"
                style={{
                  fontSize: "12px",
                  color: "#4b5563",
                  backgroundColor: "transparent",
                  borderBottom: "2px solid #93c5fd",
                  minHeight: "3rem",
                  maxHeight: "8rem",
                  overflowY: "auto",
                  lineHeight: "1.6",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleSaveBody();
                  }
                  if (e.key === "Escape") {
                    handleCancelBody();
                  }
                }}
                dangerouslySetInnerHTML={{ __html: tempBody }}
              />
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleSaveBody}
                  className="p-1 text-green-600 rounded hover:bg-green-50"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={handleCancelBody}
                  className="p-1 text-red-600 rounded hover:bg-red-50"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-2">
                <p
                  className="text-xs leading-relaxed text-gray-600 whitespace-pre-line"
                  style={{
                    fontSize: "12px",
                    lineHeight: "1.6",
                    color: "#4b5563",
                    whiteSpace: "pre-line",
                  }}
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
              {isEditable && onEditBody && (
                <button
                  onClick={startEditingBody}
                  className="flex-shrink-0 p-1 text-gray-400 transition-opacity rounded opacity-0 hover:text-blue-600 hover:bg-blue-50 group-hover:opacity-100"
                >
                  <Edit size={16} />
                </button>
              )}
            </div>
          )}
        </div>

        {error && <div className="mt-3 text-xs text-red-500">{error}</div>}

        {isEditable && showDelete && (
          <button
            className="absolute p-3 text-red-500 transition-colors rounded-full -top-1 -right-2 hover:bg-red-50 "
            onClick={onDelete}
            title="Hapus insight"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default InsightCard;
