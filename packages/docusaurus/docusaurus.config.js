// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import configs from "../../config.json";
import {resolve} from "url"
import 'dotenv/config';

// @ts-ignore
const {TITLE, TAGLINE, DOCUSAURUS_URL, PROJECT_NAME, HEDGEDOC_SERVER, GITHUB_OWNER, GITHUB_REPO} = configs;
const documentGithubPath = `git/${GITHUB_OWNER}/${GITHUB_REPO}/contents/packages/docusaurus/`;
const editUrl = resolve(HEDGEDOC_SERVER, documentGithubPath)

const config = {
  title: TITLE,
  tagline: TAGLINE,
  favicon: 'img/favicon.svg',
  customFields: {
    // Put your custom environment here
    octokitToken: process.env.OCTOKIT_TOKEN,
  },
  url: DOCUSAURUS_URL,
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  organizationName: 'nqminds',
  projectName: PROJECT_NAME,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('prism-react-renderer/themes/github').Options} */
      {
        docs: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ]
  ],

  plugins: [
    [
      'docusaurus-lunr-search', {},
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "docs",
        path: "./docs/working-docs",
        routeBasePath: "docs",
        remarkPlugins: [require('remark-mermaid-dataurl')],
        editUrl,
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "schemas",
        path: "./docs/schemas",
        routeBasePath: "schemas",
        remarkPlugins: [require('remark-mermaid-dataurl')],
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        logo: {
          alt: 'NquiringMinds',
          src: 'img/nquiringminds.svg',
          width: "100px !important"
        },
        items: [{
          type: 'doc',
          docId: 'intro',
          docsPluginId: "docs",
          position: 'left',
          label: 'Working docs',
        },
        {
          type: 'doc',
          docId: 'schemas',
          docsPluginId: "schemas",
          position: 'left',
          label: 'Schemas',
        },

        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Working Docs',
                to: '/docs',
              }
            ],
          },
          {
            title: 'Schemas',
            items: [{
              label: 'Data schemas',
              to: '/schemas',
          }],
          },
          {
            title: 'More',
            items: [

              {
                label: 'GitHub',
                href: 'https://github.com/nqminds',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ${TITLE}. Built with Docusaurus.`,
      },
      colorMode: {
        defaultMode: 'light', // or 'dark' if you prefer
        disableSwitch: true, // Disables the theme switcher
      },
    }),
};

export default config;
