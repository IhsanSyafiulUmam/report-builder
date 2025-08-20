import React, { useState, useRef, useCallback } from 'react';
import { Move, RotateCcw } from 'lucide-react';

interface ResizableWrapperProps {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  isEditable?: boolean;
  onResize?: (width: number, height: number) => void;
  className?: string;
}

const ResizableWrapper: React.FC<ResizableWrapperProps> = ({
  children,
  initialWidth = 400,
  initialHeight = 300,
  minWidth = 200,
  minHeight = 150,
  maxWidth = 1200,
  maxHeight = 800,
  isEditable = false,
  onResize,
  className = "",
}) => {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });
  const startDimensions = useRef({ width: 0, height: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;

    let newWidth = startDimensions.current.width;
    let newHeight = startDimensions.current.height;

    // Calculate new dimensions based on resize direction
    if (resizeDirection.includes('right')) {
      newWidth = Math.max(minWidth, Math.min(maxWidth, startDimensions.current.width + deltaX));
    }
    if (resizeDirection.includes('left')) {
      newWidth = Math.max(minWidth, Math.min(maxWidth, startDimensions.current.width - deltaX));
    }
    if (resizeDirection.includes('bottom')) {
      newHeight = Math.max(minHeight, Math.min(maxHeight, startDimensions.current.height + deltaY));
    }
    if (resizeDirection.includes('top')) {
      newHeight = Math.max(minHeight, Math.min(maxHeight, startDimensions.current.height - deltaY));
    }

    setDimensions({ width: newWidth, height: newHeight });
  }, [isResizing, resizeDirection, minWidth, maxWidth, minHeight, maxHeight]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      setResizeDirection('');
      onResize?.(dimensions.width, dimensions.height);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isResizing, dimensions, onResize, handleMouseMove]);

  const handleMouseDown = useCallback((direction: string) => (e: React.MouseEvent) => {
    if (!isEditable) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    startPos.current = { x: e.clientX, y: e.clientY };
    startDimensions.current = { ...dimensions };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [dimensions, isEditable, handleMouseMove, handleMouseUp]);

  const resetSize = () => {
    setDimensions({
      width: initialWidth,
      height: initialHeight,
    });
    onResize?.(initialWidth, initialHeight);
  };

  const resizeHandles = [
    { position: 'top', cursor: 'n-resize', className: 'top-0 left-2 right-2 h-1' },
    { position: 'bottom', cursor: 's-resize', className: 'bottom-0 left-2 right-2 h-1' },
    { position: 'left', cursor: 'w-resize', className: 'left-0 top-2 bottom-2 w-1' },
    { position: 'right', cursor: 'e-resize', className: 'right-0 top-2 bottom-2 w-1' },
    { position: 'top-left', cursor: 'nw-resize', className: 'top-0 left-0 w-2 h-2' },
    { position: 'top-right', cursor: 'ne-resize', className: 'top-0 right-0 w-2 h-2' },
    { position: 'bottom-left', cursor: 'sw-resize', className: 'bottom-0 left-0 w-2 h-2' },
    { position: 'bottom-right', cursor: 'se-resize', className: 'bottom-0 right-0 w-2 h-2' },
  ];

  return (
    <div className={`group relative ${className}`}>
      <div
        ref={containerRef}
        className={`relative overflow-hidden rounded-lg border-2 transition-all duration-200 ${
          isResizing ? 'border-blue-400 shadow-lg' : 'border-transparent'
        } ${isEditable ? 'hover:border-gray-300' : ''}`}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
      >
        {/* Content */}
        <div className="w-full h-full overflow-auto">
          {children}
        </div>

        {/* Resize handles - only show in edit mode */}
        {isEditable && (
          <>
            {resizeHandles.map((handle) => (
              <div
                key={handle.position}
                className={`absolute bg-blue-500 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity cursor-${handle.cursor} ${handle.className}`}
                onMouseDown={handleMouseDown(handle.position)}
                style={{ cursor: handle.cursor }}
              />
            ))}
          </>
        )}
      </div>

      {/* Control buttons - only show in edit mode */}
      {isEditable && (
        <div className="absolute right-0 flex items-center gap-1 transition-opacity opacity-0 -top-8 group-hover:opacity-100">
          <button
            onClick={resetSize}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50"
            title="Reset to original size"
          >
            <RotateCcw size={12} />
            Reset
          </button>
          <div className="flex items-center gap-1 px-2 py-1 text-xs text-gray-500 bg-white border border-gray-300 rounded shadow-sm">
            <Move size={12} />
            {dimensions.width} × {dimensions.height}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResizableWrapper;
