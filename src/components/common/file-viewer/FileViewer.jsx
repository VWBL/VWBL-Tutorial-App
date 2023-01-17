import React from 'react';
import './FileViewer.css';

export const FileViewer = ({ url, alt, height, width }) => {
  return (
    <div className="File-Viewer" style={{ width: `${width}`, height: `${height}` }}>
      <div className="Image-Wrapper">
        <img src={url} alt={alt} style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </div>
    </div>
  );
};
