import React from 'react';
import { CreateCard } from '../create-card/CreateCard';
import { NFTItem } from '../nft-item/NFTItem';
import './ItemList.css';

export const ItemList = ({ nfts }) => {
  return (
    <div className="Item-List" style={nfts.length === 0 ? { justifyContent: 'center' } : {}}>
      {nfts.map((nft) => {
        return (
          <div key={nft.id}>
            <NFTItem nft={nft} />
          </div>
        );
      })}
      <CreateCard />
    </div>
  );
};
