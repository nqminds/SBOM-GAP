import React from 'react';
import styles from './Homepage.module.css';
import Link from '@docusaurus/Link';

const Sections = [
  {
    title: 'Web App',
    png: require('../../static/img/web-app.png').default,
    description: "",
    docsLink: "/app/",
  },
  {
    title: 'CLI Tool',
    png: require('../../static/img/cli.png').default,
    description: "",
    docsLink: "/cli/",
  },
];

function IconContainer({png, title, description, docsLink}) {
  let image = null;
  if (png) {
    image = (<div className="text--center">
      <img className={styles.featureImg} alt={title} src={png}/>
    </div>);
  }
  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        {image}
        <div className="text--center padding-horiz--md">
          <strong>{title}</strong>
          <p>{description}</p>
          <Link className={`${styles.button} pagination-nav__link--next`} to={docsLink}>View docs</Link>
        </div>
      </div>
    </div>
  );
}

export default function HomepageWGList() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.row}>
          {Sections.map((props, idx) => (
            <IconContainer key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
