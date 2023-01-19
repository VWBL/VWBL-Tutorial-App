import { createContainer } from 'unstated-next';
import { useState } from 'react';
import Web3 from 'web3';

const useVWBL = () => {
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState();

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error('Please install MetaMask!');
      } else {
        console.log('MetaMask is installed!', ethereum);
      }

      await ethereum.enable();
      const web3 = new Web3(ethereum);
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      setWeb3(web3);
      setUserAddress(currentAccount);

      const connectedChainId = await web3.eth.getChainId();
      const properChainId = parseInt(process.env.REACT_APP_CHAIN_ID);
      if (connectedChainId !== properChainId) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(properChainId) }],
        });
      }
    } catch (error) {
      if (error.code === 4001) {
        alert('Please connect Your Wallet.');
      } else {
        alert(error.message);
      }
      console.error(error);
    }
  };

  const disconnectWallet = () => {
    setUserAddress('');
    setWeb3(undefined);
  };

  // Lesson-3
  const initVwbl = () => {};

  return {
    userAddress,
    connectWallet,
    disconnectWallet,
    initVwbl,
  };
};

export const VwblContainer = createContainer(useVWBL);
