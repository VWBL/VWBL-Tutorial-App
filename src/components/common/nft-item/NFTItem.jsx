import { Link } from 'react-router-dom';
import './NFTItem.css';

export const NFTItem = ({ nft }) => {
  return (
    <Link to={`/assets/${nft.id}`} className="Link">
      <div className="NFT-Item">
        <div className="NFT-Display">
          <img className="NFT-Thumbnail" src={nft.image} alt={`${nft.name}`} />
        </div>
        <div className="NFT-Info">
          <span className="NFT-Title">{nft.name.length >= 24 ? `${nft.name.slice(0, 24)}...` : nft.name}</span>
          <span className="NFT-Description">
            {nft.description.length >= 125 ? `${nft.description.slice(0, 125)}...` : nft.description}
          </span>
        </div>
      </div>
    </Link>
  );
};
