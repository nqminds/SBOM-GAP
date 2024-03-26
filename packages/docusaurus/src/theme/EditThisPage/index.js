import React, { useEffect, useState } from 'react';
import EditThisPage from '@theme-original/EditThisPage';
import url from "url";


import config from '../../../../../config.json';

import CreateFile from './create-file';
import DeleteFileConfirmation from './delete-file';
import MoveFileConfirmation from './move-file';

import OctokitTools from "../../utils/octokit";
import SuccessDialog from '../../components/success-dialog';
import FailDialog from '../../components/fail-dialog';
import GithubStatus from './git-status';

const success = "success";
const fail = "fail";

const path = url.resolve(config.HEDGEDOC_SERVER, `createGithubNote/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/`);

function getGitPath(editUrl) {
  const link = editUrl.split("/git/")[1];
  const lastIndex = link.lastIndexOf('/');
  const gitPath = link.substring(0, lastIndex);

  return gitPath;
}

function getRelativePath(editUrl) {
  let relativePath = editUrl.split('/contents/')[1];
  return relativePath;
}

function EditThisPageWrapper(props) {
  const [files, setFiles] = useState([]); 
  const [selectedOption, setSelectedOption] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);


  const callback = (mode = "") => {
    switch (mode) {
      case success:
        setSuccessOpen(true);
        break;
      case fail:
        setErrorOpen(true);
    }
    setSelectedOption("");
  }

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const gitPath = getGitPath(props.editUrl);

  let octokit;
  try {
    octokit = new OctokitTools(config)
  } catch (err) {
    console.error("No token supplied");
  }

  if(!octokit){
    return (
      <>
        <EditThisPage {...props} />
      </>
    );
  }
  
 
  useEffect(() => {

    async function fetchFiles() {
      await octokit.getWorkflowRun();
      const allFiles = await octokit.getFiles(gitPath);

      const filenames = allFiles? allFiles.data.map(({ name }) => name) : [];
  
      const rootFile = gitPath.split("/").pop();
      setFiles(filenames.filter((name) => !name.includes(rootFile)));
    }

    if(selectedOption === "" || files.length === 0) {
      fetchFiles();
    }
  }, [props, selectedOption]);


  function createNewPage(filename) {
    try {
      const filePath = gitPath.split("/contents/")[1]
      const fileDir = `${filePath}/${filename}/${filename}` // create new dir for file
  
      const newFileUrl =  url.resolve(path, fileDir);
      window.open(newFileUrl, '_blank');
      callback(success);
    } catch (err) {
      callback(fail);
    }
 
  }

  async function deletePage() {
    try {
      const path = getRelativePath(props.editUrl);
      await octokit.deleteFile(path);
      callback(success);
    } catch (err) {
      callback(fail);
    }
  }

  async function moveCurrentFile(moveTo, newId) {
    try {
      if(props.editUrl !== "https://hedgedoc.nqminds.com/git/nqminds/maxad/contents/packages/docusaurus/docs/working-docs/1-intro.mdx") {

        await octokit.moveFile(getRelativePath(props.editUrl), getRelativePath(moveTo), newId);
        callback(success);
      }
    } catch (err) {
      console.log(err)
      callback(fail);
    }
  }

  return (
    <div
      className="controls"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <EditThisPage {...props} />
      <div>
        <div className="menu-select-wrapper">
          <select className="theme-edit-this-page menu-select" value={selectedOption} onChange={handleSelectChange} >
            <option value="" style={{ display: 'none' }}>File controls</option>
            <option value="add">Add file here</option>
            <option value="delete">Delete file</option>
            <option value="move">Move file</option>
          </select>
          <GithubStatus octokit={octokit} />

        </div>
        {selectedOption && (
          <div>
            {selectedOption === 'add' && <CreateFile files={files} onSubmit={createNewPage} onCancel={callback} />}
            {selectedOption === 'delete' && <DeleteFileConfirmation onDelete={deletePage} onCancel={callback}/>}
            {selectedOption === 'move' && <MoveFileConfirmation currentDir={gitPath} getFiles={(p)=> octokit.getFiles(p)} onMove={moveCurrentFile} onCancel={callback}/>}
          </div>
        )}
      </div>
      <SuccessDialog open={successOpen} setOpen={setSuccessOpen} />
      <FailDialog open={errorOpen} setOpen={setErrorOpen} />
    </div>
  );
}

export default EditThisPageWrapper;
