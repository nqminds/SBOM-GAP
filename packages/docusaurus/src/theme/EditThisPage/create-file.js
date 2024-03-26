import React, {useState } from 'react';
import Dialog from "@site/src/components/dialog"
import {createId} from "../../utils/file-id-tools";
import SelectFilePosition from './select-file-position';

const CreateFile = ({ files, onSubmit, onCancel }) => {
  const zeroIndex = "At the top";
  const [selectedOption, setSelectedOption] = useState(zeroIndex);
  const [filename, setFilename] = useState("");
  const [error, setError] = useState(null);

  const handleSelectFile = (event) => {
    setSelectedOption(event.target.value);
  };


  const handleSubmit = () => {
    if (!validateFilename(filename)) {
      setError("Filename should only contain letters, numbers, or hyphens (-). No spaces or special characters allowed.");
      return;
    }
    const id = createId(selectedOption, files);
    onSubmit(`${id}-${filename}`);
    close();
  };

  const close = () => {
    setError(null);
    setFilename("");
    onCancel();
  };
  const validateFilename = (name) => {
    const regex = /^[a-zA-Z0-9-]+$/;
    return regex.test(name);
  };

  return (
    <>
      <Dialog
        isOpen={true}
        onRequestClose={close}
        contentLabel="Create new file"
      >
        <h1>Create New File</h1>
        <label htmlFor="filenameInput">Filename:</label>
        <input type="text" id="filenameInput" value={filename} onChange={(evt) => {
          setFilename(evt.target.value);
          setError(null);
        }} />
        {error && <p style={{ color: 'red', wordWrap: 'break-word' }}>{error}</p>}
        <br />
        <SelectFilePosition selectedOption={selectedOption} handleSelectFile={handleSelectFile} files={files} zeroIndex={zeroIndex} />
        <br />
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}>
          <button onClick={handleSubmit} style={{ width: 150, color: 'white', background: "#0ea8ea" }}>Submit</button>
          <button onClick={close} style={{ width: 150 }}>Cancel</button>
        </div>
      </Dialog>
    </>
  );
};

export default CreateFile;
