import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VwblContainer } from '../../../container';
import { useDisclosure } from '../../../hooks';
import { decryptedImageData } from '../../../utils';
import { BackButton, CustomLoading, FileViewer, Section, TransferModal } from '../../common';
import { testNfts } from '../../../utils';
import './Detail.css';

export const Detail = () => {
  const [decryptedNft, setDecryptedNft] = useState();
  const [isViewingThumbnail, setViewingDataType] = useState(true);
  const { userAddress } = VwblContainer.useContainer();
  const { isOpen, handleOpen } = useDisclosure();
  const tokenId = Number(useParams().id);

  // Lesson-6
  const fechDecryptedNftByTokenId = (id) => {
    setTimeout(() => {
      const targetNft = testNfts.find((nft) => nft.id === id);
      targetNft.decrypted_image = decryptedImageData;
      targetNft.owner = userAddress;
      setDecryptedNft(targetNft);
    }, 3000);
  };

  const handleViewData = () => {
    setViewingDataType((prev) => !prev);
  };

  useEffect(() => {
    fechDecryptedNftByTokenId(tokenId);
  }, []);

  if (!decryptedNft) {
    return (
      <div style={{ height: 'calc(100vh - 160px)' }}>
        <CustomLoading />
      </div>
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 160px)', display: 'flex' }}>
      <TransferModal open={isOpen} onClose={handleOpen} nft={decryptedNft} />
      {isViewingThumbnail ? (
        <FileViewer url={decryptedNft.image} alt="NFT" height={'100%'} width={'100%'} />
      ) : (
        <FileViewer url={decryptedNft.decrypted_image} alt="NFT" height={'100%'} width={'100%'} />
      )}
      <div className="Detail-Container">
        <div className="Data-Wrapper">
          <Section title={'Title'} data={decryptedNft.name} />
          <Section title={'Description'} data={decryptedNft.description} />
          <Section title={'Owner'} data={decryptedNft.owner} />
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
          {userAddress === decryptedNft.owner && (
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
