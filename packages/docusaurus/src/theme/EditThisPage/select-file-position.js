import React from "react";

export default function({selectedOption, handleSelectFile, files, zeroIndex}) {
  return (
    <>
      <label htmlFor="fileSelect">Add the new file below:</label>
      <select id="fileSelect" onChange={handleSelectFile} value={selectedOption}>
        <option value={zeroIndex}>{zeroIndex}</option>
        {files.map(file => (
          <option key={file} value={file}>{file}</option>
        ))}
      </select>
    </>
  );
}