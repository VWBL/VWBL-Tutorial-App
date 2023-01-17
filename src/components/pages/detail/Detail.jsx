import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { VwblContainer } from '../../../container';
import { useDisclosure } from '../../../hooks';
import { decryptedImageData } from '../../../utils';
import { BackButton, CustomLoading, FileViewer, Section, TransferModal } from '../../common';
import './Detail.css';

export const Detail = () => {
  const [loadedNft, setLoadedNft] = useState();
  const [isViewingThumbnail, setViewingDataType] = useState(true);
  const { userAddress, mintedNfts, ownedNfts } = VwblContainer.useContainer();
  const { isOpen, handleOpen } = useDisclosure();
  const tokenId = Number(useParams().id);

  const handleViewData = () => {
    setViewingDataType((prev) => !prev);
  };

  const specifyNftData = useCallback(
    (id) => {
      return mintedNfts.find((nft) => nft.id === id) || ownedNfts.find((nft) => nft.id === id);
    },
    [mintedNfts, ownedNfts]
  );

  const loadNFTByTokenId = useCallback(
    (id) => {
      setTimeout(() => {
        const targetNft = specifyNftData(id);
        targetNft.decrypted_image = decryptedImageData;
        targetNft.owner = userAddress;
        setLoadedNft(targetNft);
      }, 3000);
    },
    [specifyNftData, userAddress]
  );

  useEffect(() => {
    loadNFTByTokenId(tokenId);
  }, [loadNFTByTokenId, tokenId]);

  if (!loadedNft) {
    return (
      <div style={{ height: 'calc(100vh - 160px)' }}>
        <CustomLoading />
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 160px)', display: 'flex' }}>
      <TransferModal open={isOpen} onClose={handleOpen} nft={loadedNft} />
      {isViewingThumbnail ? (
        <FileViewer url={loadedNft.image} alt="NFT" height={'100%'} width={'100%'} />
      ) : (
        <FileViewer url={loadedNft.decrypted_image} alt="NFT" height={'100%'} width={'100%'} />
      )}
      <div className="Detail-Container">
        <div className="Data-Wrapper">
          <Section title={'Title'} data={loadedNft.name} />
          <Section title={'Description'} data={loadedNft.description} />
          <Section title={'Owner'} data={loadedNft.owner} />
        </div>
        <div className="Button-Wrapper">
          {isViewingThumbnail ? (
            <button className="View-Button" onClick={handleViewData}>
              View Data
            </button>
          ) : (
            <button className="View-Button" onClick={handleViewData}>
              Return to Thumbnail
            </button>
          )}
          {userAddress === loadedNft.owner && (
            <button className="Transfer-Button" onClick={handleOpen}>
              TRANSFER
            </button>
          )}
        </div>
        <BackButton to={'/'} />
      </div>
    </div>
  );
};
