import React from 'react';
import { Bold, Italic, List, Link } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors duration-200">
          <Bold size={16} />
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors duration-200">
          <Italic size={16} />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors duration-200">
          <List size={16} />
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors duration-200">
          <Link size={16} />
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-32 p-4 resize-none focus:outline-none"
        style={{ minHeight: '120px' }}
      />
    </div>
  );
};

export default TextEditor;