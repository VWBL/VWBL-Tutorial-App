import React, { useEffect, useState } from 'react';
import { VwblContainer } from '../../../container';
import { TbWalletOff } from 'react-icons/tb';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ItemList } from '../../common';
import { testNfts } from '../../../utils';
import clsx from 'clsx';
import './Home.css';
import 'react-tabs/style/react-tabs.css';

export const Home = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [mintedNfts, setMintedNfts] = useState();
  const [ownedNfts, setOwnedNfts] = useState();
  const { userAddress, connectWallet, disconnectWallet } = VwblContainer.useContainer(); /* web3, vwblを追加 */

  // Lesson-5
  const fetchNfts = () => {
    setTimeout(() => {
      setMintedNfts(testNfts.slice(0, 2));
      setOwnedNfts(testNfts);
    }, 2000);
  };

  // Lesson-5
  useEffect(() => {
    fetchNfts();
  }, [userAddress]); /* userAddressからvwblに変更 */

  // const fetchNfts = async () => {
  //   if (!userAddress || !web3 || !vwbl) {
  //     console.log('Now your wallet is not connected. Please connect your wallet.');
  //     return;
  //   }

  //   try {
  //     /* ミントしたNFTのtokenIdの配列を取得（mintedTokenIds） */

  //     if (mintedTokenIds.length) {
  //       const mintedNfts = [];
  //       for (const tokenId of mintedTokenIds) {
  //         /* tokenIdからNFTメタデータを取得（metadata） */

  //         if (metadata) mintedNfts.push(metadata);
  //       }
  //       setMintedNfts(mintedNfts.reverse());
  //     }

  //     /* 所有しているNFTのtokenIdの配列を取得（ownedTokenIds） */

  //     if (ownedTokenIds.length) {
  //       const owendNfts = [];
  //       for (const tokenId of ownedTokenIds) {
  //         /* tokenIdからNFTメタデータを取得（metadata） */

  //         if (metadata) owendNfts.push(metadata);
  //       }

  //       setOwnedNfts(owendNfts.reverse());
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="Home-Container">
      {userAddress ? (
        <>
          <div className="Wallet-Content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 20 }}>My wallet</span>
              <span style={{ fontWeight: 700, fontSize: 16 }}>{userAddress}</span>
            </div>
            <button className="Disconnect-Button" onClick={disconnectWallet}>
              <TbWalletOff fontSize={16} />
              <span>Disconnect Wallet</span>
            </button>
          </div>
          <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList className="Tab-List">
              <Tab className={clsx('Tab', tabIndex === 0 && 'isSelectedTab')}>Created</Tab>
              <Tab className={clsx('Tab', tabIndex === 1 && 'isSelectedTab')}>Owned</Tab>
            </TabList>
            <TabPanel className={tabIndex === 0 ? 'Tab-Panel' : 'isNotSelectedTab'}>
              <ItemList nfts={mintedNfts} />
            </TabPanel>
            <TabPanel className={tabIndex === 1 ? 'Tab-Panel' : 'isNotSelectedTab'}>
              <ItemList nfts={ownedNfts} />
            </TabPanel>
          </Tabs>
        </>
      ) : (
        <div>
          <button className="Connect-Button" onClick={connectWallet}>
            Connect Wallet and dive into VWBL
          </button>
          <div className="Card-Content">
            <div className="Card">
              <button className="Create-Button" onClick={connectWallet}>
                ＋ Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
