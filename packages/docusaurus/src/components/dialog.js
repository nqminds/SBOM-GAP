import React from 'react';
import Modal from 'react-modal';

export default function ModalComponent({ isOpen, onRequestClose, contentLabel, children , width=400}) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={contentLabel}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          display: "flex",
          flexDirection: "column",
          width,
        },
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(185, 195, 199, 0.6)'
        },
      }}
    >
      {children}
    </Modal>
  );
};