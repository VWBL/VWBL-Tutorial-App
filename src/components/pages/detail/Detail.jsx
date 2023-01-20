import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VwblContainer } from '../../../container';
import { useDisclosure } from '../../../hooks';
import { BackButton, CustomLoading, FileViewer, Section, TransferModal } from '../../common';
import './Detail.css';

export const Detail = () => {
  const [decryptedNft, setDecryptedNft] = useState();
  const [isViewingThumbnail, setViewingDataType] = useState(true);
  const { userAddress, vwbl } = VwblContainer.useContainer();
  const { isOpen, handleOpen } = useDisclosure();
  const tokenId = Number(useParams().id);
  const navigate = useNavigate();

  const fechDecryptedNftByTokenId = async (id) => {
    if (!vwbl) {
      console.log('Now your wallet is not connected. Please connect your wallet.');
      return;
    }
    try {
      if (!vwbl.signature) {
        await vwbl.sign();
      }
      const decryptedNft = await vwbl.getTokenById(id);
      setDecryptedNft(decryptedNft);
    } catch (error) {
      navigate('/');
      console.log(error.message);
    }
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
        <FileViewer url={decryptedNft.ownDataBase64[0]} alt="NFT" height={'100%'} width={'100%'} />
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
