import React, { useCallback, useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { VALID_EXTENSIONS } from '../../../utils';
import { PdfViewer } from './../pdf-viewer';
import './FileViewer.css';

/**
 * FileViewer component
 * @param {*} param0 nft
 * @returns 
 */
export const FileViewer = ({ nft, isViewingThumbnail }) => {
  const [fileUrl, setFileUrl] = useState('');

  /**
   * isExtractMetadata function
   * @param {*} token 
   * @returns 
   */
  const isExtractMetadata = (token) => {
    return !!(token)?.ownDataBase64;
  };
  
  /**
   * donwload function
   */
  const download = useCallback(() => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.click();
    a.remove();
  }, [fileUrl]);
  
  useEffect(() => {
    if (isExtractMetadata(nft)) {
      const url =
        nft.encryptLogic == 'base64'
          ? nft.ownDataBase64[0]
          : URL.createObjectURL(new Blob(nft.ownFiles, { type: nft.mimeType })); 
      setFileUrl(url);
    }

    // unset memory when unmount
    return () => URL.revokeObjectURL(fileUrl);
  }, []);

  /**
   * switchViewer function
   */
  const switchViewer = useCallback(
    (nft) => {
      if (isExtractMetadata(nft)) {
        if (nft.mimeType.match(VALID_EXTENSIONS.image)) {
          return <img src={fileUrl} alt='original data' rounded='md' height='100%' width='100%' objectFit='contain' />;
        } else if (nft.mimeType.match(VALID_EXTENSIONS.video)) {
          return <ReactPlayer url={fileUrl} controls={true} width='100%' height='100%' />;
        } else if (nft.mimeType.match(VALID_EXTENSIONS.audio)) {
          return <ReactPlayer url={fileUrl} controls={true} height='54px' />;
        } else if (nft.mimeType.includes('pdf')) {
          return <PdfViewer fileUrl={fileUrl} />;
        } else {
          return <button className="View-Button" onClick={download}>Download</button>;
        }
      } else {
        return <img src={fileUrl} alt='thumbnail data' rounded='md' />;
      }
    },
    [download, fileUrl],
  );

  return (<>{switchViewer(nft)}</>);
};