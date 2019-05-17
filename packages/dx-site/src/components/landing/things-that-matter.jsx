import * as React from 'react';
import LandingTitle from './title';
import LandingIconFeature from './icon-feature';
import styles from './things-that-matter.module.scss';

export default () => (
  <div className="container">
    <div className="row">
      <LandingTitle text="And Things That Also Matter..." />
    </div>
    <div className={`row ${styles.thingsRow}`}>
      <LandingIconFeature
        title="Customization"
        description="Wide customization and extensibility capabilities. From template React components to custom plugins."
      />
      <LandingIconFeature
        title="Localization"
        description="Every textual piece of our React components is customizable. Localize or globalize your react app with ease."
      />
      <LandingIconFeature
        title="TypeScript"
        description="Create easy-to-maintain and bug-free React applications with our autogenerated TypeScript definitions."
      />
      <LandingIconFeature
        title="Docs & Examples"
        description="Improve your productivity using our comprehensive and simple docs with live React demos and code examples."
      />
    </div>
  </div>
);
