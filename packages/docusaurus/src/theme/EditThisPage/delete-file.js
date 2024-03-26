import React from 'react';
import Dialog from "@site/src/components/dialog";

function DeleteFileConfirmation({ onDelete, onCancel }) {
  const confirmDelete = () => {
    onDelete();
    close();
  };

  const close = () => {
    onCancel();
  };

  return (
    <>
      <Dialog
        isOpen={true}
        onRequestClose={close}
        contentLabel="Delete File Confirmation"
      >
        <h1>Delete File</h1>
        <p>Are you sure you want to delete the current file?</p>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}>
          <button onClick={confirmDelete} style={{ width: 150, color: 'white', background: "#0ea8ea" }}>Yes</button>
          <button onClick={close} style={{ width: 150 }}>Cancel</button>
        </div>
      </Dialog>
    </>
  );
};

export default DeleteFileConfirmation;
