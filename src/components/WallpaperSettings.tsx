
import React, { useState } from 'react';
import { Settings, Upload, X } from 'lucide-react';

interface WallpaperSettingsProps {
  onWallpaperChange: (wallpaper: string | null) => void;
  currentWallpaper: string | null;
}

const WallpaperSettings: React.FC<WallpaperSettingsProps> = ({ 
  onWallpaperChange, 
  currentWallpaper 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onWallpaperChange(result);
        localStorage.setItem('customWallpaper', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearWallpaper = () => {
    onWallpaperChange(null);
    localStorage.removeItem('customWallpaper');
  };

  const defaultWallpapers = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-colors z-40"
        title="Настройки обоев"
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-8 left-8 bg-black/80 backdrop-blur-sm rounded-lg p-4 z-40 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Настройки обоев</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-300"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Upload custom wallpaper */}
        <div>
          <label className="block text-white text-sm mb-2">Загрузить изображение</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="wallpaper-upload"
          />
          <label
            htmlFor="wallpaper-upload"
            className="flex items-center justify-center gap-2 w-full p-2 bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer transition-colors"
          >
            <Upload size={16} />
            Выбрать файл
          </label>
        </div>

        {/* Default wallpapers */}
        <div>
          <label className="block text-white text-sm mb-2">Готовые обои</label>
          <div className="grid grid-cols-3 gap-2">
            {defaultWallpapers.map((wallpaper, index) => (
              <button
                key={index}
                onClick={() => {
                  onWallpaperChange(wallpaper);
                  localStorage.setItem('customWallpaper', wallpaper);
                }}
                className="w-full h-16 rounded overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <img
                  src={wallpaper}
                  alt={`Обои ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Clear wallpaper */}
        <button
          onClick={clearWallpaper}
          className="w-full p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
        >
          Сбросить обои
        </button>
      </div>
    </div>
  );
};

export default WallpaperSettings;
