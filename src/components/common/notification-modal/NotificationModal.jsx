import React from 'react';
import { RiCheckFill } from 'react-icons/ri';
import './NotificationModal.css';

export const NotificationModal = ({ open, onClose, title, msg, isLoading }) => {
  if (open) {
    return (
      <div className="Overlay">
        <div className="Notification-Modal-Container">
          <span className="Notification-Modal-Title">{title}</span>
          <div className="Notification-Modal-Body">
            {isLoading ? <div className="Notification-Loader"></div> : <RiCheckFill fontSize={24} />}
            {msg}
          </div>
          {!isLoading && (
            <button className="Notification-Modal-Button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};
