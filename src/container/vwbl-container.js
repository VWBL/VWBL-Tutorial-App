import { useState } from 'react';
import { createContainer } from 'unstated-next';
import { ManageKeyType, UploadContentType, UploadMetadataType, VWBL } from 'vwbl-sdk';
import Web3 from 'web3';

/**
 * useVWBL Component
 * @returns 
 */
const useVWBL = () => {
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState();
  // vwbl インスタンスを作成
  const [vwbl, setVwbl] = useState();

  /**
   * connectWallet function
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        throw new Error('Please install MetaMask!');
      } else {
        console.log('MetaMask is installed!', ethereum);
      }
      // metamaskの接続を促す
      await ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(ethereum);
      // ウォレットアドレス情報を取得する。
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];
      setWeb3(web3);
      setUserAddress(currentAccount);

      // 接続中のチェーン情報を取得する。
      const connectedChainId = await web3.eth.getChainId();
      // 環境変数からチェーンIDを取得する。
      const properChainId = parseInt(process.env.REACT_APP_CHAIN_ID);
      if (connectedChainId !== properChainId) {
        // change chain
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(properChainId) }],
        });
      }
      // call initVwbl function
      initVwbl(web3);
    } catch (error) {
      if (error.code === 4001) {
        alert('Please connect Your Wallet.');
      } else {
        alert(error.message);
      }
      console.error(error);
    }
  };

  /**
   * disconectWallet function
   */
  const disconnectWallet = () => {
    setUserAddress('');
    setWeb3(undefined);
    setVwbl(undefined);
  };

  /**
   * initVwbl function
   * @param {*} web3 
   */
  const initVwbl = (web3) => {
    // create VWBM インスタンス
    const vwblInstance = new VWBL({
      web3,
      contractAddress: process.env.REACT_APP_NFT_CONTRACT_ADDRESS,
      vwblNetworkUrl: process.env.REACT_APP_VWBL_NETWORK_URL,
      manageKeyType: ManageKeyType.VWBL_NETWORK_SERVER,
      uploadContentType: UploadContentType.IPFS,
      uploadMetadataType: UploadMetadataType.IPFS,
      ipfsNftStorageKey: process.env.REACT_APP_NFT_STORAGE_KEY,
    });
    setVwbl(vwblInstance);
  };

  return {
    userAddress,
    web3,
    vwbl,
    connectWallet,
    disconnectWallet,
    initVwbl,
  };
};

export const VwblContainer = createContainer(useVWBL);
