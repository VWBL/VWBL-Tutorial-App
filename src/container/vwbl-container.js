import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { testNfts } from '../utils';

const useVWBL = () => {
  const [userAddress, setUserAddress] = useState('');
  const [mintedNfts, setMintedNfts] = useState();
  const [ownedNfts, setOwnedNfts] = useState();
  const connectWallet = () => {
    setUserAddress('0x0000000000000000000000000000000000000000');
  };

  const disconnectWallet = () => {
    setUserAddress('');
    setMintedNfts();
    setOwnedNfts();
  };

  const fetchNFTs = () => {
    setTimeout(() => {
      setMintedNfts(testNfts.slice(0, 2));
      setOwnedNfts(testNfts);
    }, 2000);
  };

  return {
    userAddress,
    mintedNfts,
    ownedNfts,
    connectWallet,
    disconnectWallet,
    fetchNFTs,
  };
};

export const VwblContainer = createContainer(useVWBL);
