import React, { useEffect, useState } from 'react';
import { VwblContainer } from '../../../container';
import { TbWalletOff } from 'react-icons/tb';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ItemList } from '../../common';
import clsx from 'clsx';
import './Home.css';
import 'react-tabs/style/react-tabs.css';

export const Home = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [mintedNfts, setMintedNfts] = useState();
  const [ownedNfts, setOwnedNfts] = useState();
  const { userAddress, vwbl, web3, connectWallet, disconnectWallet } = VwblContainer.useContainer();

  const fetchNfts = async () => {
    if (!userAddress || !web3 || !vwbl) {
      console.log('Now your wallet is not connected. Please connect your wallet.');
      return;
    }

    try {
      const mintedTokenIds = await vwbl.getTokenByMinter(userAddress);
      if (mintedTokenIds.length) {
        const mintedNfts = [];
        for (const tokenId of mintedTokenIds) {
          const metadata = await vwbl.getMetadata(tokenId);
          if (metadata) mintedNfts.push(metadata);
        }
        setMintedNfts(mintedNfts.reverse());
      }

      const ownedTokenIds = await vwbl.getOwnTokenIds();
      if (ownedTokenIds.length) {
        const owendNfts = [];
        for (const tokenId of ownedTokenIds) {
          const metadata = await vwbl.getMetadata(tokenId);
          if (metadata) owendNfts.push(metadata);
        }
        setOwnedNfts(owendNfts.reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, [vwbl]);

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
