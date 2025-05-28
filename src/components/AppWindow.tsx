
import React from 'react';
import { X, Minus, Square } from 'lucide-react';

interface AppWindowProps {
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  onDrag: (newPosition: { x: number; y: number }) => void;
  onResize: (newSize: { width: number; height: number }) => void;
}

const AppWindow: React.FC<AppWindowProps> = ({
  title,
  isOpen,
  onClose,
  onMinimize,
  children,
  position,
  size,
  onDrag,
  onResize
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = React.useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDownHeader = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      onDrag({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else if (isResizing) {
      const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(200, resizeStart.height + (e.clientY - resizeStart.y));
      onResize({ width: newWidth, height: newHeight });
    }
  }, [isDragging, isResizing, dragStart, resizeStart, onDrag, onResize]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex: 1000
      }}
    >
      {/* Window Header */}
      <div
        className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 cursor-move"
        onMouseDown={handleMouseDownHeader}
      >
        <span className="text-white text-sm font-medium">{title}</span>
        <div className="flex space-x-2">
          <button
            onClick={onMinimize}
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 transition-colors"
          />
          <button
            onClick={onClose}
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors flex items-center justify-center"
          >
            <X size={8} className="text-red-900" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full bg-gray-900 text-white p-4 overflow-auto">
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleMouseDownResize}
      >
        <div className="w-full h-full bg-gray-600 opacity-50"></div>
      </div>
    </div>
  );
};

export default AppWindow;
