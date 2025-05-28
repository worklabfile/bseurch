
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  id: string;
  icon: LucideIcon;
  label: string;
  position: { x: number; y: number };
  onDoubleClick: () => void;
  onDrag: (newPosition: { x: number; y: number }) => void;
  isSelected: boolean;
  onSelect: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon: Icon,
  label,
  position,
  onDoubleClick,
  onDrag,
  isSelected,
  onSelect
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onSelect();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      onDrag({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, onDrag]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      className={`absolute cursor-pointer select-none group ${
        isSelected ? 'bg-blue-500/20 rounded-lg' : ''
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mb-1 shadow-lg">
          <Icon size={24} className="text-white" />
        </div>
        <span className="text-white text-xs max-w-16 text-center truncate">
          {label}
        </span>
      </div>
    </div>
  );
};

export default DesktopIcon;
