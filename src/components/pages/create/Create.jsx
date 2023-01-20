import React, { useState, useEffect, useCallback } from 'react';
import { VALID_EXTENSIONS, MAX_FILE_SIZE } from '../../../utils';
import { FilePreviewer, BackButton, NotificationModal } from '../../common';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import './Create.css';
import { useDisclosure } from '../../../hooks';
import { VwblContainer } from '../../../container';

export const Create = () => {
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState('');
  const [thumbnail, setThumbnail] = useState();
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { isOpen, handleOpen } = useDisclosure();
  const { web3, vwbl, connectWallet } = VwblContainer.useContainer();

  // Lesson-4
  const mintNft = async (data) => {
    if (Object.keys(errors).length !== 0) {
      // エラーを確認
      console.log('errors', errors);
      return;
    }

    // Loading開始
    setIsLoading(true);

    // web3またはvwblインスタンスがundefinedの場合
    if (!web3 || !vwbl) {
      alert('Your wallet is not connected. Please try again.');
      setIsLoading(false);
      await connectWallet();
      return;
    }

    // 各入力データを抽出
    const { asset, thumbnail, title, description } = data;

    try {
      // VWBLネットワークに対する署名を確認
      if (!vwbl.signature) {
        await vwbl.sign();
        return;
      }

      // VWBL NFTを発行
      await vwbl.managedCreateTokenForIPFS(title, description, asset[0], thumbnail[0], 0);

      // Loading終了
      setIsLoading(false);

      // Completeモーダルを表示
      handleOpen();
    } catch (error) {
      // エラー内容を表示
      console.log(error);
      alert(error.message);

      // Loading終了
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onChangeFile = useCallback((e) => {
    const file = e.target.files[0];
    setFile(file);
  }, []);

  const onChangeThumbnail = useCallback((e) => {
    const thumbnail = e.target.files[0];
    if (!thumbnail?.type.match(VALID_EXTENSIONS.image)) {
      alert('Image mime type is not valid');
      return;
    }
    setThumbnail(thumbnail);
  }, []);

  const onClearFile = useCallback(() => {
    setFileUrl('');
    setFile(undefined);
  }, []);

  const onClearThumbnail = useCallback(() => {
    setThumbnailUrl('');
    setThumbnail(undefined);
  }, []);

  useEffect(() => {
    let fileReaderForFile;
    let fileReaderForThumbnail;
    let isCancel = false;
    if (file) {
      fileReaderForFile = new FileReader();
      fileReaderForFile.onload = () => {
        const result = fileReaderForFile.result;
        if (result && !isCancel) {
          setFileUrl(result);
        }
      };
      fileReaderForFile.readAsDataURL(file);
    }
    if (thumbnail) {
      fileReaderForThumbnail = new FileReader();
      fileReaderForThumbnail.onload = () => {
        const result = fileReaderForThumbnail.result;
        if (result && !isCancel) {
          setThumbnailUrl(result);
        }
      };
      fileReaderForThumbnail.readAsDataURL(thumbnail);
    }
    return () => {
      isCancel = true;
      if (fileReaderForFile && fileReaderForFile.readyState === 1) {
        fileReaderForFile.abort();
      }
      if (fileReaderForThumbnail && fileReaderForThumbnail.readyState === 1) {
        fileReaderForThumbnail.abort();
      }
    };
  }, [file, thumbnail]);

  return (
    <div className="Create-Container">
      <div style={{ paddingTop: '60px' }}>
        <BackButton to={'/'} />
      </div>
      <div className="Create-Title">VWBL NFTの作成</div>
      <form className="Input-Form" onSubmit={handleSubmit(mintNft)}>
        <div className="Topic">
          <label className="Topic-Title" title="Asset" htmlFor="asset">
            NFTデータ
          </label>
          <span className="Topic-Description">NFTを持っている人だけがみることができるデータ</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FilePreviewer
            url={fileUrl}
            inputId="asset"
            acceptType=".jpeg,.jpg,.png,.gif"
            opt={{
              ...register('asset', {
                required: 'Asset is required',
                validate: {
                  maxFileSize: (f) => f[0].size < MAX_FILE_SIZE || 'uploaded file is too large',
                },
              }),
            }}
            onChange={onChangeFile}
            onClear={onClearFile}
          />
          <span style={{ fontSize: '16px', color: 'red', paddingTop: '8px' }}>
            <ErrorMessage errors={errors} name="asset" />
          </span>
        </div>
        <div className="Topic">
          <label className="Topic-Title" title="Thumbnail" htmlFor="thumbnail">
            サムネイル
          </label>
          <span className="Topic-Description">誰でもみることができるサムネイルデータ</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <FilePreviewer
            url={thumbnailUrl}
            inputId="thumbnail"
            acceptType=".jpeg,.jpg,.png,.gif"
            opt={{
              ...register('thumbnail', {
                required: 'Thumbnail is required',
                validate: {
                  maxFileSize: (f) => f[0].size < MAX_FILE_SIZE || 'uploaded file is too large',
                },
              }),
            }}
            onChange={onChangeThumbnail}
            onClear={onClearThumbnail}
          />
          <span style={{ fontSize: '16px', color: 'red', paddingTop: '8px' }}>
            <ErrorMessage errors={errors} name="thumbnail" />
          </span>
        </div>
        <div className="Topic">
          <label className="Topic-Title" title="Title" htmlFor="title">
            タイトル
          </label>
          <input
            className="Text-Input"
            id="title"
            type="text"
            placeholder="NFTデータのタイトルを入力"
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <span style={{ fontSize: '16px', color: 'red', paddingTop: '8px' }}>
            <ErrorMessage errors={errors} name="title" />
          </span>
        </div>
        <div className="Topic">
          <label className="Topic-Title" title="Description" htmlFor="description">
            説明文
          </label>
          <input
            className="Text-Input"
            id="description"
            type="text"
            placeholder="NFTデータに関する説明文を入力"
            {...register('description', {
              required: 'Description is required',
              minLength: { value: 4, message: 'Minimum length should be 4' },
            })}
          />
          <span style={{ fontSize: '16px', color: 'red', paddingTop: '8px' }}>
            <ErrorMessage errors={errors} name="description" />
          </span>
        </div>
        <div className="Terms-of-Service">
          <input
            type="checkbox"
            className="Checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span style={{ fontSize: '12px' }}>
            <a
              href="https://ango-ya.notion.site/5632a448348b4722b2256e016dcc0cb4"
              target="_blank"
              rel="noreferrer"
              style={{ fontWeight: 'bold', color: 'black' }}
            >
              利用規約
            </a>
            に同意する
          </span>
        </div>
        <div className="Mint-Content">
          <button type="submit" className="Mint-Button" disabled={!isChecked}>
            {isLoading ? (
              <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', gap: 10 }}>
                <div className="Mint-Loader"></div>
                NFTを作成中です...
              </div>
            ) : (
              <div>VWBL NFTの作成</div>
            )}
          </button>
          <span style={{ fontSize: '12px' }}>
            新しいアイテムの作成には数分かかる場合があります。
            <br />
            読み込みをしている最中に別のページに移動しないでください
          </span>
        </div>
      </form>
      <NotificationModal
        open={isOpen}
        onClose={handleOpen}
        title={'Complete'}
        msg={'Minted your NFT'}
        isLoading={false}
      />
    </div>
  );
};
