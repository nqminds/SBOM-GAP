// This is just a script, so console statements are fine
/* eslint-disable no-console */
const fs = require("node:fs/promises");
const {spawn} = require("node:child_process");

const http = require("node:http");
const path = require("node:path");
const serveHandler = require("serve-handler");
const {loadSiteConfig} = require("@docusaurus/core/lib/server/config");
const docsToPdf = require.resolve("docs-to-pdf");

async function makeServer(siteDir, dir = "build") {
  const {
    siteConfig,
  } = await loadSiteConfig({
    siteDir,
    // customConfigFilePath: cliOptions.config,
  });

  const {baseUrl, trailingSlash} = siteConfig;

  const server = http.createServer((req, res) => {
    // Automatically redirect requests to /baseUrl/
    if (!req.url?.startsWith(baseUrl)) {
      res.writeHead(302, {
        Location: baseUrl,
      });
      res.end();
      return;
    }

    // Remove baseUrl before calling serveHandler, because /baseUrl/ should
    // serve /build/index.html, not /build/baseUrl/index.html (does not exist)
    req.url = req.url?.replace(baseUrl, "/");

    serveHandler(req, res, {
      cleanUrls: true,
      public: path.isAbsolute(dir) ? dir : path.join(siteDir, dir),
      trailingSlash,
      // See https://github.com/facebook/docusaurus/pull/6701
      // Without this, issues are caused with generating protobuf documentation
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

  const {port, address} = server.address();
  console.log(`Listening on http://${address}:${port}`);

  return {server, siteConfig};
}

/**
 * Creates a PDF from a Docusuarus Docs page, and saves it to `pdf/<docsPath>.pdf`.
 *
 * @param {object} params - Parameters.
 * @param {string} params.baseUrl - Docusaurus Base URL.
 * @param {number} params.port - Port.
 * @param {string} params.address - Address (e.g "localhost").
 * @param {string} params.docsPath - Docs `routeBasePath`, without leading `/`.
 * @param {string} [params.docsIndex] - Docs index.
 * @param {string} params.title - Title to use on PDF title page.
 * @param {string} params.subtitle - Subtitle to use on PDF title page.
 * @returns {Promise<void>} Resolves when pdf has been created.
 */
async function makePDF({baseUrl, port, address, title, subtitle}) {
  const outputPDFFilename = `pdf/${title}.pdf`;
  console.log(`Creating PDF ${outputPDFFilename}`);

  await fs.mkdir("pdf", {recursive: true});

  let initialDocsUrl = `http://${address}:${port}${baseUrl}`;

  const pdfOpts = {
    initialDocURLs: [initialDocsUrl],
    // Docusaurus v2 CSS for next button
    paginationSelector: ".pagination-nav__link--next",
    // Docusaurus v2 CSS to exclude from PDF
    excludeSelectors: [
      ".fixedHeaderContainer",
      "footer.nav-footer",
      "#docsNav",
      "nav.onPageNav",
      "a.theme-edit-this-page",
      "div.docs-prevnext",
      "div.theme-doc-toc-mobile",
      ".pagination-nav__link--next",
      ".demo"
    ].join(","),
    contentSelector: "article",
    coverTitle: title,
    coverSub: subtitle,
    cssStyle:"body{background: #757575;}",
    outputPDFFilename,
    pdfMargin: "96,40,90,50",
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
    cssStyle: "body {font-family: Arial, sans-serif !important; box-shadow: none !important;}"
  };

  return await new Promise((resolve, reject) => {
    const pdfProcess = spawn(
      docsToPdf,
      Object.entries(pdfOpts).flatMap(([k, v]) => [`--${k}`, v]),
      {stdio: "inherit"},
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

/**
 * Returns a list of docusaurus docs instances from the docusaurus config.
 *
 * @param {Awaited<ReturnType<makeServer>>["siteConfig"]} config Docusaurus config.
 * @returns {{docsPath: string, docIndex?: string}[]} List of docusaurus docs instances.
 */
function findDocsFromConfig(config) {
  const array = [];
  const presetClassic = config.presets.find(
    ([plugin]) => (
      plugin === "@docusaurus/preset-classic"
      || plugin === "classic"
    )
  );
  if (presetClassic) {
    const [_, settings] = presetClassic;
    if (settings?.docs ?? true) {
      array.push({
        docsPath: settings.docs?.routeBasePath ?? "docs",
        docsIndex: null,
      });
    }
  }
  // TODO: Support protodocs (unknown why this is broken)
  const presetProtobuffet = config.presets.find(([plugin]) => plugin === "docusaurus-protobuffet");
  if (presetProtobuffet) {
    const [_, settings] = presetProtobuffet;
    array.push({
      docsPath: settings.docs?.routeBasePath ?? "protodocs",
      docsIndex: "DCon.proto", // todo, automatically load this from sidebars?
    });
  }

  for (const [plugin, settings] of config.plugins ?? []) {
    if (plugin !== "@docusaurus/plugin-content-docs") {
      continue;
    }
    array.push({
      docsPath: settings.routeBasePath,
      docsIndex: null,
    });
  }

  return array;
}

async function makePDFs() {
  const siteDir = await fs.realpath(".");
  const {server, siteConfig} = await makeServer(siteDir);

  const {baseUrl, title} = siteConfig;

  const {port, address} = server.address();



  try {
    const attempt = await makePDF({
      baseUrl,
      port,
      address,
      title,
      subtitle: "Autonomous Cognitive Security Agents"
    })
    // await Promise.all(
    //   [
    //     ...findDocsFromConfig(siteConfig),
    //     // Instead of using all files from docusaurus.config.js, you can
    //     // manually add in the paths you want to make PDFs from
    //     // {
    //     //   docsPath: "/example-path/to/docs",
    //     //   docsIndex: "example.html", // optional
    //     // },
    //   ]
    //     // you can use filter to remove docs you don't want to generate PDFs for
    //     .filter(({docsPath}) => docsPath !== "example")
    //     .map(({docsPath, docsIndex, ...props}) => {
    //       if (docsPath.startsWith("/")) {
    //         docsPath = docsPath.slice(1);
    //       }
    //       return makePDF({
    //         baseUrl,
    //         port,
    //         address,
    //         docsPath,
    //         docsIndex,
    //         title,
    //         subtitle: docsPath,
    //       });
    //     })
    // );
  } finally {
    server.close();
  }
}

makePDFs();
