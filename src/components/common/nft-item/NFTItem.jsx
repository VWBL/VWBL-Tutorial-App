import { Link } from 'react-router-dom';
import './NFTItem.css';

export const NFTItem = (nft) => {
  console.log(nft.nft.image);
  return (
    <Link to={`/assets/${nft.nft.id}`} className="Link">
      <div className="NFT-Item">
        <div className="NFT-Image">
          <img src={nft.nft.image} alt={`${nft.nft.name}`} width={260} height={340} />
        </div>
        <div className="NFT-Info">
          <text className="NFT-Title">
            {nft.nft.name.length >= 24 ? `${nft.nft.name.slice(0, 24)}...` : nft.nft.name}
          </text>
          <text className="NFT-Description">
            {nft.nft.description.length >= 140 ? `${nft.nft.description.slice(0, 140)}...` : nft.nft.description}
          </text>
        </div>
      </div>
    </Link>
  );
};
