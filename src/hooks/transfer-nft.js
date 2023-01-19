import { useState } from 'react';

export const useTransferNft = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Lesson-7
  const transferNft = (data) => {
    console.log('submitted data', data);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsComplete(true);
    }, 4000);
  };

  const handleComplete = () => {
    setIsComplete((prev) => !prev);
  };

  return {
    isComplete,
    isLoading,
    transferNft,
    handleComplete,
  };
};
