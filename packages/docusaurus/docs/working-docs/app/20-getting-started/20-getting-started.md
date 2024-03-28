---
title: Getting Started
---
# Prerequisites:

Before installing the cyber application, ensure that your environment meets the following requirements:

Node.js: You must have Node.js version `16.16.0` or higher installed on your machine. You can download and install Node.js from the official [Node.js](https://nodejs.org/en/download) website.

npm: This project requires npm version `8.7.0` or higher. npm is distributed with [Node.js](https://nodejs.org/en/download), which means that when you download Node.js, you automatically get npm installed on your computer.

Git: The source code is hosted on GitHub, so you will need Git installed to clone the repository.

### Installation Guide:

Clone the Repository:
Open your terminal and run the following command to clone the source repository:

```sh
git clone https://github.com/nqminds/cyber.git
cd cyber
```

Install Dependencies:
Once inside the project directory, install the necessary dependencies by running:

```sh
npm install
```

### Configuration:

Create a `.env` file in the root directory of the project to store your environment variables. 
Add the following:

```env
NIST_API_KEY=your_nist_api_key
OPENAI_API_KEY=your_openai_api_key
PORT=8080%
```
The OPENAI_API_KEY is not mandatory, however it helps to classify new CWEs.

### Running the Application:
Navigate to cyber/packages/server and run the following command to start the server
```sh
npm start
```

Now, in a separate terminal window, navigate to cyber/packages/app and run the following command to start the application
```sh
npm run dev
```
In a browser open http://localhost:8081/ to view the app

### Linting and Code Formatting:
Before committing changes, you can ensure your code follows the linting and formatting standards by running:

```sh
npm run lint
```

Testing:

```sh
npm test
```