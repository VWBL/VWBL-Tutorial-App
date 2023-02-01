import { ErrorMessage } from '@hookform/error-message';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { VwblContainer } from '../../../container';
import { useDisclosure } from '../../../hooks';
import { BASE64_MAX_SIZE, MAX_FILE_SIZE, VALID_EXTENSIONS } from '../../../utils';
import { BackButton, FilePreviewer, NotificationModal } from '../../common';
import './Create.css';

/**
 * Create Component
 * @returns 
 */
export const Create = () => {
  const [file, setFile] = useState();
  const [fileUrl, setFileUrl] = useState('');
  const [mimeType, setMimeType] = useState('');
  const [thumbnail, setThumbnail] = useState();
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const { isOpen, handleOpen } = useDisclosure();

  // get vwbl instace
  const { web3, vwbl, connectWallet } = VwblContainer.useContainer();

  /**
   * mintNft function
   * @param {*} data 
   * @returns 
   */
  const mintNft = async (data) => {
    setIsLoading(true);
    if (!web3 || !vwbl) {
      alert('Your wallet is not connected. Please try again.');
      setIsLoading(false);
      await connectWallet();
      return;
    }
    const { asset, thumbnail, title, description } = data;

    try {
      if (!vwbl.signature) {
        // call sign function
        // vwblネットワークに対する署名を確認する。
        await vwbl.sign();
      }

      if (!title || !description || !asset || !thumbnail) {
        console.log('Something went wrong.');
        return;
      }

      const isLarge = asset[0].size > MAX_FILE_SIZE;
      const isBase64 = asset[0].size < BASE64_MAX_SIZE;
      const plainFile = isLarge ? segmentation(asset[0], MAX_FILE_SIZE) : asset[0];
      // call managedCreateTokenForIPFS function (mint VWBL NFT)
      await vwbl.managedCreateTokenForIPFS(title, description, plainFile, thumbnail[0], 0, isBase64 ? 'base64' : 'binary',);
      // await vwbl.managedCreateToken(title, description, asset[0], thumbnail[0],0);

      setIsLoading(false);
      handleOpen();
    } catch (error) {
      console.error(error);
      alert(error.message);
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  /**
   * onChangeFile function
   */
  const onChangeFile = useCallback((e) => {
    const file = e.target.files[0];
    setMimeType(file.type);
    setFile(file);
  }, []);

  /**
   * onChangeThumbnail function
   */
  const onChangeThumbnail = useCallback((e) => {
    const thumbnail = e.target.files[0];
    if (!thumbnail?.type.match(VALID_EXTENSIONS.image || VALID_EXTENSIONS.audio || VALID_EXTENSIONS.video || 'pdf')) {
      alert('Image mime type is not valid');
      return;
    }
    setThumbnail(thumbnail);
  }, []);

  /**
   * onClearFile function
   */
  const onClearFile = useCallback(() => {
    setFileUrl('');
    setFile(undefined);
  }, []);

  /**
   * onClearThumbnail function
   */
  const onClearThumbnail = useCallback(() => {
    setThumbnailUrl('');
    setThumbnail(undefined);
  }, []);

  /**
   * segmentation function
   * @param {*} file 
   * @param {*} segmentSize 
   * @returns 
   */
  const segmentation = (file, segmentSize) => {
    const segments = [];
    let fi = 0;
    while (fi * segmentSize < file.size) {
      const segment = file.slice(fi * segmentSize, (fi + 1) * segmentSize);
      segments.push(new File([segment], `${file.name}-${fi}`, { type: file.type }));
      ++fi;
    }
  
    return segments;
  };

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
            acceptType=".jpeg,.jpg,.png,.gif,.mp4,.mov,.mp3,.pdf"
            labelText={'Image, Video, Audio, or PDF'}
            mimeType={mimeType}
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
            labelText={'Image'}
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
