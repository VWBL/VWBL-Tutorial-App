import React from 'react';
import { VscChromeClose } from 'react-icons/vsc';
import './FilePreviewer.css';

export const FilePreviewer = ({ url, inputId, acceptType, opt, onChange, onClear }) => {
  return (
    <div className="Container">
      {url ? (
        <div style={{ width: '100%', height: '100%' }}>
          <VscChromeClose className="Close-Button" onClick={onClear} />
          <div className="Preview-Image">
            <img src={url} alt="selectedFile" style={{ maxHeight: '100%', maxWidth: '100%' }} />
          </div>
        </div>
      ) : (
        <div className="Button-Content">
          <span className="Notification">
            Image（{acceptType}）
            <br />
            Max 1.5GB
          </span>
          <label className="Label" htmlFor={inputId} {...opt}>
            Choose File
            <input hidden id={inputId} type="file" {...opt} onChange={onChange} accept={acceptType} />
          </label>
        </div>
      )}
    </div>
  );
};
