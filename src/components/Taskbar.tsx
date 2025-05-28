
import React from 'react';
import { Search, Settings, Grid3X3, Clock } from 'lucide-react';

interface TaskbarProps {
  openWindows: string[];
  onWindowClick: (windowId: string) => void;
  currentTime: string;
}

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, onWindowClick, currentTime }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 flex items-center justify-between px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Grid3X3 size={20} className="text-white" />
        </button>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Search size={20} className="text-white" />
        </button>
      </div>

      {/* Center Section - Open Windows */}
      <div className="flex items-center space-x-1 flex-1 justify-center">
        {openWindows.map((windowId) => (
          <button
            key={windowId}
            onClick={() => onWindowClick(windowId)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
          >
            {windowId}
          </button>
        ))}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 text-white text-sm">
          <Clock size={16} />
          <span>{currentTime}</span>
        </div>
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Settings size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default Taskbar;
