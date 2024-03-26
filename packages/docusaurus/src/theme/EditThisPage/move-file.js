import React, { useState, useEffect } from 'react';
import Dialog from "@site/src/components/dialog";
import SelectFilePosition from './select-file-position';

import { getFileId, createId } from '../../utils/file-id-tools';

const zeroIndex = "At the top";
const Slash = () =>  <> / </>;

function MoveFileConfirmation({ currentDir, onMove, onCancel, getFiles, rootFile}) {
  const workingDocsIndex = currentDir.indexOf("/working-docs");
  const base = currentDir.substring(0, workingDocsIndex + "/working-docs".length);
  const extension = currentDir.substring(workingDocsIndex + "/working-docs/".length);

  const [path, setPath] = useState(extension);
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);
  const [fileIdSelected, setFileIdSelected] = useState(zeroIndex);

  useEffect(() => {
    const fetchDirectories = async () => {
      try {
        const directoriesFromServer = await getFiles(`${base}/${path}`);
        const directories = directoriesFromServer.data.filter(({type}) => type ==="dir").map(({name}) => name)
        setDirectories(directories);
        const rootFile = path.split("/").pop();
        setFiles(directoriesFromServer.data.map(({name}) => name).filter((name) => !rootFile || !name.includes(rootFile)));
      } catch (error) {
        console.error('Error fetching directories:', error);
      }
    };

    fetchDirectories();
  }, [path]);


  const navigateToDirectory = (index) => {
    // Get the path up to the selected index
    const newPath = path.split('/').slice(0, index + 1).join('/');
    setPath(newPath);
  };

  const appendDirectory = (selectedValue) => {
    if (!!selectedValue) {
      setPath(path === '' ? selectedValue : `${path}/${selectedValue}`);
    }
  };

  const goBack = () => {
    // Trim the last directory from the path
    const newPath = path.substring(0, path.lastIndexOf('/'));
    setPath(newPath);
  };

  const confirmMove = () => {
    const newId = createId(fileIdSelected, files);
    onMove(`${base}/${path}`, newId); // Pass newFilename to onMove callback
    close();
  };

  const close = () => {
    onCancel();
    setPath(extension);
  };

  return (
    <>
      <Dialog
        isOpen={true}
        onRequestClose={close}
        contentLabel="Move File Confirmation"
        width={600}
      >
        <h1>Move File</h1>
        <h2>X NOT CURRENTLY WORKING X</h2>
        <p>Are you sure you want to move the current file?</p>
        <label htmlFor="newFilenameInput">Path:</label>
        <div>
          <button onClick={() => setPath("")}>root</button>
          <Slash/>
          {!!path && path.split('/').map((directory, index) => (
            <span key={index}>
              <button onClick={() => navigateToDirectory(index)}>{directory}</button>
              {(index < path.split('/').length - 1) && <Slash/>}
            </span>
          ))}
          {!!path && <Slash/>}
          <select value={""} onChange={(e) => appendDirectory(e.target.value)}>
            <option value="" style={{display: 'none'}}>Add directory path</option>
            {directories.map((directory) => (
              <option key={directory} value={directory}>{directory}</option>
            ))}
          </select>
        </div>
        <br />
        <SelectFilePosition selectedOption={fileIdSelected} handleSelectFile={(evt) => setFileIdSelected(evt.target.value)} files={files} zeroIndex={zeroIndex} />
        <br/>
        <div style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}>
          {path && <button style={{ width: 150 }} onClick={goBack}>Up</button>}
          <button onClick={close} style={{ width: 150 }}>Cancel</button>
          <button onClick={confirmMove} style={{ width: 150, color: 'white', background: "#0ea8ea" }}>Move</button>
        </div>
      </Dialog>
    </>
  );
};

export default MoveFileConfirmation;
