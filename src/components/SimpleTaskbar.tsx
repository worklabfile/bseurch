
import React from 'react';
import { Plus, Clock } from 'lucide-react';

interface SimpleTaskbarProps {
  onAddLink: () => void;
  currentTime: string;
  linkCount: number;
}

const SimpleTaskbar: React.FC<SimpleTaskbarProps> = ({ onAddLink, currentTime, linkCount }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 flex items-center justify-between px-4 z-50">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={onAddLink}
          className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
          title="Добавить ссылку"
        >
          <Plus size={16} className="text-white" />
          <span className="text-white text-sm">Добавить ссылку</span>
        </button>
        
        <span className="text-gray-400 text-sm">
          Ссылок: {linkCount}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 text-white text-sm">
        <Clock size={16} />
        <span>{currentTime}</span>
      </div>
    </div>
  );
};

export default SimpleTaskbar;
