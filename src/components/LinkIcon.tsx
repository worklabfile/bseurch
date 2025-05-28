
import React from 'react';
import { Globe } from 'lucide-react';

interface LinkIconProps {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  position: { x: number; y: number };
  onDoubleClick: () => void;
  onDrag: (newPosition: { x: number; y: number }) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const LinkIcon: React.FC<LinkIconProps> = ({
  url,
  title,
  favicon,
  position,
  onDoubleClick,
  onDrag,
  isSelected,
  onSelect,
  onDelete
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [faviconError, setFaviconError] = React.useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) return; // Ignore right click
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onSelect();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newX = Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 120, e.clientY - dragStart.y));
      
      onDrag({ x: newX, y: newY });
    }
  }, [isDragging, dragStart, onDrag]);

  const handleMouseUp = React.useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onDelete();
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp, { passive: false });
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url: string) => {
    if (favicon) return favicon;
    try {
      const domain = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const faviconUrl = getFaviconUrl(url);

  const handleFaviconError = () => {
    setFaviconError(true);
  };

  return (
    <div
      className={`absolute cursor-pointer select-none group transition-transform duration-75 ${
        isSelected ? 'bg-blue-500/20 rounded-lg' : ''
      } ${isDragging ? 'z-50 scale-105' : 'z-10'}`}
      style={{ 
        left: position.x, 
        top: position.y,
        transform: isDragging ? 'rotate(2deg)' : 'none'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={onDoubleClick}
      onContextMenu={handleContextMenu}
      title={`${title}\n${url}\nПравый клик для удаления`}
    >
      <div className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-xl flex items-center justify-center mb-1 shadow-lg overflow-hidden border border-gray-500/20">
          {faviconUrl && !faviconError ? (
            <img 
              src={faviconUrl} 
              alt={title}
              className="w-8 h-8 object-contain"
              onError={handleFaviconError}
              loading="lazy"
              style={{ imageRendering: 'crisp-edges' }}
            />
          ) : (
            <Globe size={20} className="text-white" />
          )}
        </div>
        <span className="text-white text-xs max-w-20 text-center truncate">
          {title || getDomain(url)}
        </span>
      </div>
    </div>
  );
};

export default LinkIcon;
