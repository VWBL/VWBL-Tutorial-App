import { createContainer } from 'unstated-next';
import { useState } from 'react';
import Web3 from 'web3'; // この1行を追加

const useVWBL = () => {
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState(); // この1行を追加

  // Lesson-2
  const connectWallet = async () => {
    try {
      // windowオブジェクトからethereumオブジェクトを抽出
      const { ethereum } = window;

      // ethereumオブジェクトの有無を確認
      if (!ethereum) {
        throw new Error('Please install MetaMask!');
      } else {
        console.log('MetaMask is installed!', ethereum);
      }

      // ウォレットに接続
      await ethereum.send('eth_requestAccounts');

      // web3インスタンスの生成
      const web3 = new Web3(ethereum);

      // ユーザーアドレスを取得
      const accounts = await web3.eth.getAccounts();
      const currentAccount = accounts[0];

      // 各変数のstateを保存
      setWeb3(web3);
      setUserAddress(currentAccount);

      // ネットワークを確認
      const connectedChainId = await web3.eth.getChainId();
      const properChainId = parseInt(process.env.REACT_APP_CHAIN_ID); // 今回の場合、Mumbaiの80001
      if (connectedChainId !== properChainId) {
        // ネットワークがMumbaiでない場合はネットワークを変更
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: web3.utils.toHex(properChainId) }],
        });
      }
    } catch (error) {
      if (error.code === 4001) {
        // ユーザーが接続を拒否したとき
        alert('Please connect Your Wallet.');
      } else {
        // ethreumオブジェクトが確認できなかった時など
        alert(error.message);
      }

      // エラー内容を開発者コンソールに表示
      console.error(error);
    }
  };

  // Lesson-2
  const disconnectWallet = () => {
    // 各変数のstateをリセット
    setUserAddress('');
    setWeb3(undefined);
  };

  // Lesson-3
  const initVwbl = () => {};

  return {
    userAddress,
    web3, // この1行を追加
    connectWallet,
    disconnectWallet,
    initVwbl,
  };
};

export const VwblContainer = createContainer(useVWBL);
