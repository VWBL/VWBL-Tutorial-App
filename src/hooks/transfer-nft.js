import { useState } from 'react';
import { VwblContainer } from '../container';
import { useParams, useNavigate } from 'react-router-dom';

export const useTransferNft = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { vwbl } = VwblContainer.useContainer();
  const tokenId = Number(useParams().id);
  const navigate = useNavigate();

  const transferNft = async (data) => {
    if (!vwbl) {
      console.log('Now your wallet is not connected. Please connect your wallet.');
      return;
    }
    const { address } = data;
    setIsLoading(true);

    try {
      await vwbl.safeTransfer(address, tokenId);
      setIsLoading(false);
      setIsComplete(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    setIsComplete((prev) => !prev);
    navigate('/');
  };

  return {
    isComplete,
    isLoading,
    transferNft,
    handleComplete,
  };
};
