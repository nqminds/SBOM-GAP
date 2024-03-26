// Relative to /packages/docusaurus/package.json

const config = require('../../../config.json'); // Adjust the path as needed
const url = require("url");

const yaml_filepath = "../schemas/src/";
const output_dir = "./docs/schemas";
const hedgedoc_server = config.HEDGEDOC_SERVER;
// Relative path to yaml schemas
const relative_git_path =`git/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/packages/schemas/`

const path = url.resolve(hedgedoc_server, relative_git_path)
const { spawn } = require('child_process');

// Specify the command and its arguments
const command = 'npx';
const args = [
  'schemaTools',
  'generate-docusaurus-files',
  yaml_filepath,
  output_dir,
  path,
];

// Spawn the child process
const childProcess = spawn(command, args, { stdio: 'inherit' });

// Handle process exit
childProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('Command executed successfully.');
  } else {
    console.error(`Command failed with exit code ${code}.`);
  }
});
