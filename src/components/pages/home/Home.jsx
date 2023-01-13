import React, { useState } from 'react';
import { VwblContainer } from '../../../container';
import { TbWalletOff } from 'react-icons/tb';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import clsx from 'clsx';
import './Home.css';
import 'react-tabs/style/react-tabs.css';
import { ItemList } from '../../common';
import { testNftData } from '../../../utils/test-data/NFT_test_data';

export const Home = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { userAddress, connectWallet, disconnectWallet } = VwblContainer.useContainer();
  const mintedNFTs = testNftData.slice(0, 2);
  const ownedNFTs = testNftData;
  return (
    <div className="Home-Container">
      {userAddress ? (
        <>
          <div className="Wallet-Content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <text style={{ fontWeight: 700, fontSize: 20 }}>My wallet</text>
              <text style={{ fontWeight: 700, fontSize: 16 }}>{userAddress}</text>
            </div>
            <button className="Disconnect-Button" onClick={disconnectWallet}>
              <TbWalletOff fontSize={16} />
              <text>Disconnect Wallet</text>
            </button>
          </div>
          <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList className="Tab-List">
              <Tab className={clsx('Tab', tabIndex === 0 && 'isSelectedTab')}>Created</Tab>
              <Tab className={clsx('Tab', tabIndex === 1 && 'isSelectedTab')}>Owned</Tab>
            </TabList>
            <TabPanel className={tabIndex === 0 ? 'Tab-Panel' : 'isNotSelectedTab'}>
              <ItemList nfts={mintedNFTs} />
            </TabPanel>
            <TabPanel className={tabIndex === 1 ? 'Tab-Panel' : 'isNotSelectedTab'}>
              <ItemList nfts={ownedNFTs} />
            </TabPanel>
          </Tabs>
        </>
      ) : (
        <div>
          <button className="Connect-Button" onClick={connectWallet}>
            Walletを接続してVWBLをはじめる
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
