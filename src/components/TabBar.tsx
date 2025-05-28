
import React from 'react';
import { X, Plus } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
}

const TabBar: React.FC<TabBarProps> = ({ 
  tabs, 
  activeTab, 
  onTabSelect, 
  onTabClose, 
  onNewTab 
}) => {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700 px-2 py-1 flex items-center space-x-1 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center min-w-0 max-w-64 px-3 py-2 rounded-t-lg cursor-pointer group transition-colors ${
            activeTab === tab.id 
              ? 'bg-white text-gray-900' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
          onClick={() => onTabSelect(tab.id)}
        >
          {tab.favicon ? (
            <img 
              src={tab.favicon} 
              alt="" 
              className="w-4 h-4 mr-2 flex-shrink-0"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-4 h-4 mr-2 flex-shrink-0 bg-gray-400 rounded"></div>
          )}
          
          <span className="truncate text-sm flex-1 min-w-0">
            {tab.title || new URL(tab.url).hostname}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className={`ml-2 p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0 ${
              activeTab === tab.id ? 'hover:bg-gray-200' : 'hover:bg-gray-500'
            }`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
      
      <button
        onClick={onNewTab}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors flex-shrink-0"
        title="Новая вкладка"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default TabBar;
