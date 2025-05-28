
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface GoogleSearchProps {
  onSearch?: (query: string) => void;
}

const GoogleSearch: React.FC<GoogleSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent, searchEngine: 'google' | 'yandex') => {
    e.preventDefault();
    if (query.trim()) {
      let url: string;
      
      if (query.includes('.') && !query.includes(' ')) {
        url = query.startsWith('http') ? query : `https://${query}`;
      } else {
        switch (searchEngine) {
          case 'google':
            url = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
            break;
          case 'yandex':
            url = `https://yandex.ru/search/?text=${encodeURIComponent(query.trim())}`;
            break;
          default:
            url = `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
        }
      }
      
      window.open(url, '_blank');
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e, 'google');
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center">
      {/* BSEUrch Logo */}
      <div className="text-6xl font-light text-white mb-8">
        <span className="text-blue-400">B</span>
        <span className="text-red-400">s</span>
        <span className="text-yellow-400">e</span>
        <span className="text-blue-400">u</span>
        <span className="text-green-400">r</span>
        <span className="text-red-400">c</span>
        <span className="text-purple-400">h</span>
      </div>
      
      {/* Search Form */}
      <div className="w-full max-w-lg mb-6">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Поиск или введите URL"
            className="w-full px-12 py-3 text-lg rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
        
        {/* Search Engine Buttons */}
        <div className="flex justify-center mt-6 space-x-3">
          <button
            onClick={(e) => handleSubmit(e, 'google')}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm transition-colors"
          >
            Google
          </button>
          <button
            onClick={(e) => handleSubmit(e, 'yandex')}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors"
          >
            Яндекс
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSearch;
