import React from 'react';
import './CustomLoading.css';

export const CustomLoading = () => {
  return (
    <div className="Loading-Container">
      <img src="/VWBL_BLINK_LOGO.gif" alt="vwbl_blink" width={180} height={180} />
      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Now Loading ...</span>
    </div>
  );
};
