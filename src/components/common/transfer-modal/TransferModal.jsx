import { ErrorMessage } from '@hookform/error-message';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTransferNft } from '../../../hooks';
import { FileViewer } from '../file-viewer/FileViewer';
import { NotificationModal } from '../notification-modal/NotificationModal';
import './TransferModal.css';

/**
 * TransferModal component
 * @param {*} param0 
 * @returns 
 */
export const TransferModal = ({ open, onClose, nft }) => {
  const { isComplete, isLoading, transferNft, handleComplete } = useTransferNft();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (open && !isLoading && !isComplete) {
    return (
      <div className="Overlay">
        <div className="Transfer-Modal-Container">
          <FileViewer url={nft.ownDataBase64[0]} alt="NFT" height={'300px'} width={'100%'} />
          <form style={{ padding: '40px' }} onSubmit={handleSubmit(transferNft)}>
            <div className="Transfer-Modal-Actions">
              <Section title="Title" data={nft.name} />
              <Section title="Description" data={nft.description} />
              <div className="Section">
                <label className="Section-Title" title="Address" htmlFor="address">
                  Wallet Address
                </label>
                <input
                  className="Wallet-Input"
                  id="address"
                  type="text"
                  placeholder="Input wallet address"
                  {...register('address', {
                    required: 'Wallet address is required',
                    validate: {
                      requiredLength: (addr) => addr.length === 42 || 'invalid wallet address',
                    },
                  })}
                />
                <span style={{ fontSize: '16px', color: 'red', paddingTop: '8px' }}>
                  <ErrorMessage errors={errors} name="address" />
                </span>
              </div>
            </div>
            <div className="Transfer-Modal-Button-Wrapper">
              <button className="Cancel-Button" onClick={onClose}>
                Cancel
              </button>
              <button className="Approve-Button" type="submit">
                Transfer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (isLoading && !isComplete) {
    return (
      <NotificationModal
        open={isLoading}
        onClose={undefined}
        title={'Transferring'}
        msg={'Transferring your NFT'}
        isLoading={true}
      />
    );
  } else {
    return (
      <NotificationModal
        open={isComplete}
        onClose={() => {
          handleComplete();
          onClose();
        }}
        title={'Complete'}
        msg={'Transferred your NFT'}
        isLoading={false}
      />
    );
  }
};

export const Section = ({ title, data }) => {
  return (
    <div className="Section">
      <div className="Section-Title">{title}</div>
      <span
        className="Section-Data"
        style={
          title === 'Title'
            ? { fontSize: '24px', fontWeight: 700 }
            : title === 'Owner'
            ? { fontSize: '12px' }
            : { fontSize: '14px' }
        }
      >
        {data}
      </span>
    </div>
  );
};
