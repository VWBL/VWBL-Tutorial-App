import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VwblContainer } from '../../../container';
import { useDisclosure } from '../../../hooks';
import { BackButton, CustomLoading, FileViewer, Section, TransferModal } from '../../common';
import './Detail.css';

/**
 * Detail Component
 */
export const Detail = () => {
  const [decryptedNft, setDecryptedNft] = useState();
  const [isViewingThumbnail, setViewingDataType] = useState(true);
  
  // get vwbl instance
  const { userAddress, vwbl } = VwblContainer.useContainer();
  const { isOpen, handleOpen } = useDisclosure();
  const tokenId = Number(useParams().id);
  const navigate = useNavigate();

  /**
   * fetchDecryptedNftByTokenId function
   * @param {*} id 
   */
  const fetchDecryptedNftByTokenId = async (id) => {
    try {
      if (!vwbl) {
        throw new Error('Now your wallet is not connected. Please connect your wallet.');
      }
      if (!vwbl.signature) {
        // call sign function
        await vwbl.sign();
      }
      // get decrypted NFT data
      const decryptedNft = await vwbl.getTokenById(id);
      setDecryptedNft(decryptedNft);
    } catch (error) {
      navigate('/');
      console.error(error);
    }
  };

  /**
   * handleViewData function
   */
  const handleViewData = () => {
    setViewingDataType((prev) => !prev);
  };

  useEffect(() => {
    fetchDecryptedNftByTokenId(tokenId);
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
        <img src={decryptedNft.image} alt='thumbnail data' rounded='md' />
      ) : (
        <FileViewer nft={decryptedNft} />
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
