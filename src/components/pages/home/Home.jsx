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
  const { userAddress, vwbl, web3, connectWallet, disconnectWallet } = VwblContainer.useContainer(); // web3,vwblを追加

  // Lesson-5
  const fetchNfts = async () => {
    // userAddressまたはweb3またはvwblインスタンスがundefinedの場合は関数を終了
    if (!userAddress || !web3 || !vwbl) {
      console.log('Now your wallet is not connected. Please connect your wallet.');
      return;
    }

    try {
      // ミントしたNFTのtokenIdの配列を取得
      const mintedTokenIds = await vwbl.getTokenByMinter(userAddress);

      // mintedTokenIds内に値が存在する場合
      if (mintedTokenIds.length) {
        // 取得したメタデータを保存する配列を定義
        const mintedNfts = [];

        // mintedTokenIdsをもとにループ処理
        for (const tokenId of mintedTokenIds) {
          // tokenIdからNFTメタデータを取得
          const metadata = await vwbl.getMetadata(tokenId);

          // metadataが存在する場合はmintedNftsに追加
          if (metadata) mintedNfts.push(metadata);
        }

        // 最新のNFTが一覧の上に来るように順番を入れ替えて保存
        setMintedNfts(mintedNfts.reverse());
      }

      // 所有しているNFTのtokenIdの配列を取得
      const ownedTokenIds = await vwbl.getOwnTokenIds();

      // ownedTokenIds内に値が存在する場合
      if (ownedTokenIds.length) {
        // 取得したメタデータを保存する配列を定義
        const owendNfts = [];

        // ownedTokenIdsをもとにループ処理
        for (const tokenId of ownedTokenIds) {
          // tokenIdからNFTメタデータを取得
          const metadata = await vwbl.getMetadata(tokenId);

          // metadataが存在する場合はowendNftsに追加
          if (metadata) owendNfts.push(metadata);
        }

        // 最新のNFTが一覧の上に来るように順番を入れ替えて保存
        setOwnedNfts(owendNfts.reverse());
      }
    } catch (error) {
      // エラー内容を表示
      console.error(error);
    }
  };

  // Lesson-5
  useEffect(() => {
    fetchNfts();
  }, [vwbl]); // userAddressを削除してvwblを指定

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
