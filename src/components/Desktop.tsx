import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import LinkIcon from './LinkIcon';
import AddLinkModal from './AddLinkModal';
import GoogleSearch from './GoogleSearch';
import TabBar from './TabBar';
import WebView from './WebView';
import WallpaperSettings from './WallpaperSettings';

interface DesktopLink {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  position: { x: number; y: number };
}

interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

const Desktop: React.FC = () => {
  const [links, setLinks] = useState<DesktopLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(true);
  const [wallpaper, setWallpaper] = useState<string | null>(null);

  const defaultLinks: Omit<DesktopLink, 'id' | 'position'>[] = [
    {
      url: 'https://elearning.bseu.by/my/',
      title: 'BSEU eLearning',
      favicon: 'https://www.google.com/s2/favicons?domain=elearning.bseu.by&sz=32'
    },
    {
      url: 'https://bseu.by/schedule/',
      title: 'BSEU Расписание',
      favicon: 'https://www.google.com/s2/favicons?domain=bseu.by&sz=32'
    },
    {
      url: 'https://chatgpt.com/',
      title: 'chatgpt',
      favicon: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=32'
    },
    {
      url: 'https://deepseek.com/',
      title: 'deepseek',
      favicon: 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=32'
    }
  ];

  useEffect(() => {
    // Load saved links from localStorage
    const savedLinks = localStorage.getItem('desktopLinks');
    if (savedLinks) {
      try {
        const parsedLinks = JSON.parse(savedLinks);
        setLinks(parsedLinks);
      } catch (error) {
        console.error('Error loading saved links:', error);
        // If error loading, set default links
        setDefaultLinks();
      }
    } else {
      // No saved links, set defaults
      setDefaultLinks();
    }

    // Load saved tabs from localStorage
    const savedTabs = localStorage.getItem('desktopTabs');
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        setTabs(parsedTabs);
        if (parsedTabs.length > 0) {
          setActiveTab(parsedTabs[0].id);
          setShowSearch(false);
        }
      } catch (error) {
        console.error('Error loading saved tabs:', error);
      }
    }

    // Load saved wallpaper
    const savedWallpaper = localStorage.getItem('customWallpaper');
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    }
  }, []);

  const setDefaultLinks = () => {
    const linksWithPositions: DesktopLink[] = defaultLinks.map((link, index) => ({
      ...link,
      id: Date.now().toString() + index,
      position: { 
        x: 50 + (index % 10) * 100, 
        y: 50 + Math.floor(index / 10) * 120 
      }
    }));
    setLinks(linksWithPositions);
  };

  useEffect(() => {
    // Save links to localStorage whenever links change
    localStorage.setItem('desktopLinks', JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    // Save tabs to localStorage whenever tabs change
    localStorage.setItem('desktopTabs', JSON.stringify(tabs));
  }, [tabs]);

  const handleSearch = (url: string) => {
    openNewTab(url);
  };

  const openNewTab = (url: string) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: '',
      url,
      favicon: getFaviconUrl(url)
    };

    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
    setShowSearch(false);

    // Try to fetch page title
    fetchPageTitle(url, newTab.id);
  };

  const fetchPageTitle = async (url: string, tabId: string) => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.contents) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');
        const titleElement = doc.querySelector('title');
        
        if (titleElement && titleElement.textContent) {
          setTabs(prev => prev.map(tab => 
            tab.id === tabId 
              ? { ...tab, title: titleElement.textContent || tab.title }
              : tab
          ));
        }
      }
    } catch (error) {
      console.log('Could not fetch page title:', error);
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return undefined;
    }
  };

  const handleAddLink = (url: string, title?: string) => {
    const newLink: DesktopLink = {
      id: Date.now().toString(),
      url,
      title: title || '',
      position: { 
        x: 50 + (links.length % 10) * 100, 
        y: 50 + Math.floor(links.length / 10) * 120 
      }
    };

    setLinks(prev => [...prev, newLink]);

    if (!title) {
      fetchPageTitle(url, newLink.id);
    }
  };

  const handleLinkDoubleClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleTabClose = (tabId: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== tabId);
      
      if (activeTab === tabId) {
        if (newTabs.length > 0) {
          setActiveTab(newTabs[newTabs.length - 1].id);
        } else {
          setActiveTab(null);
          setShowSearch(true);
        }
      }
      
      return newTabs;
    });
  };

  const handleLinkDrag = (linkId: string, newPosition: { x: number; y: number }) => {
    setLinks(prev => prev.map(link => 
      link.id === linkId ? { ...link, position: newPosition } : link
    ));
  };

  const handleLinkDelete = (linkId: string) => {
    setLinks(prev => prev.filter(link => link.id !== linkId));
    if (selectedLink === linkId) {
      setSelectedLink(null);
    }
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedLink(null);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedLink) {
      handleLinkDelete(selectedLink);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedLink]);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const backgroundStyle = wallpaper 
    ? { 
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex flex-col"
      style={backgroundStyle}
    >
      {tabs.length > 0 && (
        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          onTabSelect={setActiveTab}
          onTabClose={handleTabClose}
          onNewTab={() => setShowSearch(true)}
        />
      )}

      <div className="flex-1 relative">
        {showSearch || !currentTab ? (
          <div 
            className="h-full relative"
            onClick={handleDesktopClick}
          >
            <GoogleSearch />

            {links.map((link) => (
              <LinkIcon
                key={link.id}
                id={link.id}
                url={link.url}
                title={link.title}
                favicon={link.favicon}
                position={link.position}
                onDoubleClick={() => handleLinkDoubleClick(link.url)}
                onDrag={(newPosition) => handleLinkDrag(link.id, newPosition)}
                isSelected={selectedLink === link.id}
                onSelect={() => setSelectedLink(link.id)}
                onDelete={() => handleLinkDelete(link.id)}
              />
            ))}

            <WallpaperSettings 
              onWallpaperChange={setWallpaper}
              currentWallpaper={wallpaper}
            />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors z-40"
              title="Добавить ссылку"
            >
              <Plus size={24} />
            </button>

            {links.length === 0 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 pointer-events-none">
                <p className="text-sm text-center">Добавьте ссылки на избранные сайты</p>
              </div>
            )}
          </div>
        ) : (
          <WebView url={currentTab.url} title={currentTab.title} />
        )}
      </div>

      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddLink}
      />
    </div>
  );
};

export default Desktop;
