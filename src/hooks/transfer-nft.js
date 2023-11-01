import { useState } from 'react';
import { VwblContainer } from '../container'; // この１行を追加
import { useParams, useNavigate } from 'react-router-dom'; // この１行を追加

export const useTransferNft = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { vwbl } = VwblContainer.useContainer(); //この１行を追加
  const tokenId = Number(useParams().id); //この１行を追加
  const navigate = useNavigate(); //この１行を追加

  // Lesson-7
  const transferNft = async (data) => {
    // vwblが存在しない場合
    if (!vwbl) {
      console.log('Now your wallet is not connected. Please connect your wallet.');
      return;
    }

    // フォームから受け取ったデータを抽出
    const { address } = data;

    //　Loadingモーダルを表示する
    setIsLoading(true);

    try {
      // VWBL NFTを送信
      await vwbl.safeTransfer(address, tokenId);

      //　Loadingモーダルを閉じる
      setIsLoading(false);

      // 送信完了モーダルを表示する
      setIsComplete(true);
    } catch (error) {
      // エラー内容の表示
      console.error(error);

      //　Loadingモーダルを閉じる
      setIsLoading(false);
    }
  };

  // Lesson-7
  const handleComplete = () => {
    setIsComplete((prev) => !prev);

    // ホーム画面へ遷移させる
    navigate('/');
  };

  return {
    isComplete,
    isLoading,
    transferNft,
    handleComplete,
  };
};
