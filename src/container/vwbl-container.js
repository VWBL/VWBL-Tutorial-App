import { createContainer } from 'unstated-next';
import { useState } from 'react';

const useVWBL = () => {
  const [userAddress, setUserAddress] = useState('');
  const connectWallet = () => {
    setUserAddress('0x00000000000000000000000000000000');
  };

  const disconnectWallet = () => {
    setUserAddress('');
  };

  return {
    userAddress,
    connectWallet,
    disconnectWallet,
  };
};

export const VwblContainer = createContainer(useVWBL);
