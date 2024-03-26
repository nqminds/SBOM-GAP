import { Octokit } from "@octokit/core";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { getFileId} from "./file-id-tools";


class OctokitTools {
  constructor(config) {
    const {siteConfig: {customFields}} = useDocusaurusContext();
    const octokitToken = customFields.octokitToken;

    this.owner = config.GITHUB_OWNER;
    this.repo = config.GITHUB_REPO;
        
    this.octokit = new Octokit({ 
      auth: octokitToken,
    });
    
    this.headers = {
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async request(uri, body = {}) {
    return this.octokit.request(uri, { ...body, headers: this.headers });
  }

  async getFiles(path) {
    const files = await this.request(`GET /repos/${path}`);
    return files;
  }

  async deleteFile(path) {
    const owner = this.owner;
    const repo = this.repo;

    // Get the current content of the file
    const { data: { sha } } = await this.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
      }
    );

    // Delete the file
    await this.request(
      "DELETE /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path,
        message: "Delete file",
        sha, // SHA of the file
      }
    );
  }

  async moveFile(fromPath, toPath, newId) {
    const fileName = fromPath.split("/").pop() ?? path;
    const fileId  = getFileId(fileName );
 
    const newFilename = fileName.replace(fileId, newId);

    const owner = this.owner;
    const repo = this.repo;

    console.log(newFilename)
    // Get the current content of the file
    const { data: {name, content} } = await this.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        path: fromPath,
      }
    );

    const toPathName = `${toPath}/${newFilename}`;

    const branch = await this.request(`GET /repos/${owner}/${repo}/git/ref/heads/main`);

    const latestCommitSHA = branch.data.object.sha;

    const { data: { sha: blobSha } } = await this.request('POST /repos/{owner}/{repo}/git/blobs', {
      owner,
      repo,
      content,
      encoding: 'base64'
    });

    // Get the existing tree for the latest commit
    const { data: latestTree } = await this.request(`GET /repos/${owner}/${repo}/git/trees/${latestCommitSHA}`);

    // Create a new tree with the moved file
    const newTree = latestTree.tree.map(item => {
      if (item.path === fromPath) {
        // Replace the old path with the new one
        return { ...item, path: toPathName};
      }
      return item;
    });

    // Add the new file to the tree
    newTree.push({
      path: toPathName,
      mode: '100644',
      type: 'blob',
      sha: blobSha,
    });

    // Create a new tree object
    const { data: { sha: newTreeSha } } = await this.request('POST /repos/{owner}/{repo}/git/trees', {
      owner,
      repo,
      tree: newTree,
    });

    // Create a new commit
    const { data: { sha: newCommitSha } } = await this.request('POST /repos/{owner}/{repo}/git/commits', {
      owner,
      repo,
      message: 'Hedgedoc: Move file',
      tree: newTreeSha,
      parents: [latestCommitSHA]
    });

    // Update the main branch reference to point to the new commit
    await this.request('PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}', {
      owner,
      repo,
      branch: "main",
      sha: newCommitSha,
      force: true,
    });

    await this.deleteFile(fromPath);
   }

  async getWorkflowRun() {
    try {
      const owner = this.owner;
      const repo = this.repo;

      const {data} = await this.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
        owner,
        repo,
        workflow_id: "deploy.yaml",
        per_page: 5
      })

      return data.workflow_runs || [];
    } catch (error) {
      console.error('Error retrieving workflow runs:', error);
      return [];
    }
  }
}

export default OctokitTools;
