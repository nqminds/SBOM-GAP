// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
import configs from "../../config.json";
// @ts-ignore
const {TITLE, TAGLINE, DOCUSAURUS_URL, PROJECT_NAME, HEDGEDOC_SERVER, GITHUB_OWNER, GITHUB_REPO} = configs;
const documentGithubPath = `git/${GITHUB_OWNER}/${GITHUB_REPO}/contents/packages/docusaurus/`;


const config = {
  title: TITLE,
  tagline: TAGLINE,
  favicon: 'img/favicon.ico',

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
        title: 'My Site',
        logo: {
          alt: 'NquiringMinds',
          src: 'img/nquiringminds.svg',
        },
        items: [

        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              // Insert links here
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
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
