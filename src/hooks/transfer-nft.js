import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VwblContainer } from '../container';

/**
 * useTransferNft component
 * @returns 
 */
export const useTransferNft = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // get vwbl instance
  const { vwbl } = VwblContainer.useContainer();
  const tokenId = Number(useParams().id);
  const navigate = useNavigate();

  /**
   * transferNft function
   * @param {*} data 
   * @returns 
   */
  const transferNft = async (data) => {
    if (!vwbl) {
      console.log('Now your wallet is not connected. Please connect your wallet.');
      return;
    }
    // form dataからaddressを取得する。
    const { address } = data;
    setIsLoading(true);

    try {
      // call safeTransfer function
      await vwbl.safeTransfer(address, tokenId);
      setIsLoading(false);
      setIsComplete(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  /**
   * handleComplete function
   */
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
