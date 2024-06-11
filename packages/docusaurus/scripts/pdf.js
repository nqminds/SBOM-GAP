// This is just a script, so console statements are fine
/* eslint-disable no-console */
const fs = require("node:fs/promises");
const { spawn } = require("node:child_process");


const http = require("node:http");
const path = require("node:path");
const serveHandler = require("serve-handler");
const { loadSiteConfig } = require("@docusaurus/core/lib/server/config");
const docsToPdf = require.resolve("docs-to-pdf");

async function makeServer(siteDir, dir = "build") {
  const {
    siteConfig,
  } = await loadSiteConfig({
    siteDir,
    // customConfigFilePath: cliOptions.config,
  });

  const { baseUrl, trailingSlash } = siteConfig;

  const server = http.createServer((req, res) => {
    if (!req.url?.startsWith(baseUrl)) {
      res.writeHead(302, { Location: baseUrl });
      res.end();
      return;
    }

    req.url = req.url?.replace(baseUrl, "/");

    serveHandler(req, res, {
      cleanUrls: true,
      public: path.isAbsolute(dir) ? dir : path.join(siteDir, dir),
      trailingSlash,
      directoryListing: false,
    });
  });

  await new Promise((resolve, reject) => {
    server.listen(null, "localhost", (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(server);
      }
    });
  });

  const { port, address } = server.address();
  console.log(`Listening on http://${address}:${port}`);

  return { server, siteConfig };
}

/**
 * Creates a PDF from a Docusaurus Docs page and saves it to `pdf/<title>.pdf`.
 *
 * @param {object} params - Parameters.
 * @param {string} params.baseUrl - Docusaurus Base URL.
 * @param {number} params.port - Port.
 * @param {string} params.address - Address (e.g "localhost").
 * @param {string} params.title - Title to use on PDF title page.
 * @param {string} params.subtitle - Subtitle to use on PDF title page.
 * @param {string[]} params.initialDocURLs - Initial document URLs.
 * @param {string[]} [params.excludeSelectors=[]] - Selectors to exclude from the PDF.
 * @returns {Promise<void>} Resolves when PDF has been created.
 */
async function makePDF({ baseUrl, port, address, title, subtitle, initialDocURLs, excludeSelectors = [], section }) {
  const outputPDFFilename = `pdf/${title}-${subtitle.replaceAll("/", "-")}.pdf`;
  console.log(`Creating PDF ${outputPDFFilename}`);

  await fs.mkdir("pdf", { recursive: true });

  const path = require('path');

  // Specify the path to your .css file
  const cssFilePath = path.join(__dirname, 'pdf-styles.css');

  // Read the .css file as a string
  const cssStyle = await fs.readFile(cssFilePath, 'utf8')


  const pdfOpts = {
    initialDocURLs,
    paginationSelector: `.pagination-nav__link--next[href^='/${section}']`,
    excludeSelectors: [
      ".menu-select-wrapper",
      ".fixedHeaderContainer",
      "footer.nav-footer",
      "#docsNav",
      "nav.onPageNav",
      "a.theme-edit-this-page",
      "div.docs-prevnext",
      "div.theme-doc-toc-mobile",
      ".pagination-nav__link--next",
      ".demo",
      "a.new-meeting",
      ...excludeSelectors,
    ].join(","),
    contentSelector: "article",
    coverTitle: title,
    coverSub: subtitle,
    cssStyle,
    outputPDFFilename,
    pdfMargin: "96,90,90,100",
    footerTemplate: `
      <div>
        <div style="font-size: 10px; text-align: center; width: 100%;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
        <div style="padding-left: 30px; padding-right: 30px; font-size: 8px; color: #757575;">
          <p>
            This document is the property of <strong>nquiring</strong>Minds. It contains confidential and proprietary information for the individual or entity to which it was provided by <strong>nquiring</strong>Minds, only for the purposes expressly communicated by <strong>nquiring</strong>Minds. If you are not the intended recipient, you are hereby notified that any disclosure, copying, distribution, dissemination or use of the contents of this document is strictly prohibited. If you have received this document in error, please notify the sender immediately and delete the document. <strong>nquiring</strong>Minds cannot accept any liability for loss or damage resulting from the use of the information in this document. Copyright (c) 2023, <strong>nquiring</strong>Minds. All rights reserved.
          </p>
        </div>
      </div>
    `,
    headerTemplate: "<div></div>",
  };

  return new Promise((resolve, reject) => {
    const pdfProcess = spawn(
      docsToPdf,
      Object.entries(pdfOpts).flatMap(([k, v]) => [`--${k}`, v]),
      { stdio: "inherit" }
    );
    pdfProcess.on("error", reject);
    pdfProcess.on("close", (code, signal) => {
      if (code !== 0) {
        reject(new Error(`${docsToPdf} exited with code ${code}`));
      } else if (signal) {
        reject(new Error(`${docsToPdf} exited with signal ${signal}`));
      } else {
        resolve();
      }
    });
  });
}

async function makePDFs(section) {
  const siteDir = await fs.realpath(".");
  const { server, siteConfig } = await makeServer(siteDir);

  const { title, baseUrl } = siteConfig;
  const { port, address } = server.address();

  try {
    const sectionUrl = `http://${address}:${port}${baseUrl}${section}`;
    console.log("Section URL:", sectionUrl);

    const excludeSelectors = ["a.pagination-nav__link.pagination-nav__link--next[href*='/docs/data/']"];

    await makePDF({
      baseUrl,
      port,
      address,
      title,
      subtitle: section.replace(/\/$/, ''), // Remove trailing slash
      initialDocURLs: [sectionUrl],
      excludeSelectors,
      section
    });
  } finally {
    server.close();
  }
}

// Get the section from the command-line arguments
let section = process.argv[2];
if (!section) {
  console.error("No section added, defaulting to entire site.");
  section = "docs/"
}

makePDFs(section);
