
import React from 'react';

interface WebViewProps {
  url: string;
  title?: string;
}

const WebView: React.FC<WebViewProps> = ({ url, title }) => {
  return (
    <div className="flex-1 bg-white">
      <iframe
        src={url}
        title={title || url}
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-navigation"
      />
    </div>
  );
};

export default WebView;
