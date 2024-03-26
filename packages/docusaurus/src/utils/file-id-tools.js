const zeroIndex = "At the top";

function getFileId(filename) {
  const match = String(filename).match(/^(\d+)-/);
  if (match) {
    return parseInt(match[1]);
  } else {
    return 0;
  }
}

function createId(selectedOption, files) {
  let id = 0;

  if (selectedOption !== zeroIndex) {
    const currentFileId = getFileId(selectedOption);

    const nextFileIndex = files.indexOf(selectedOption) + 1;
    id = nextFileIndex === files.length || getFileId(files[nextFileIndex]) === 0  ? currentFileId + 10 : Math.ceil((getFileId(files[nextFileIndex]) + currentFileId) / 2);

  } else {
    id = files.length ? Math.floor(getFileId(files[0]) / 2) : 10;
  }
  return id;
}

export {
  getFileId, createId,
}