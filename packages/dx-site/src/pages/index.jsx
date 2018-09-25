import * as React from 'react';
import Layout from '../components/layout';
import Header from '../components/header';
import MainLogo from '../components/logos/main';
import LandingHeaderAddon from '../components/landing/header-addon';
import LandingLayout from '../components/landing/layout';
import LandingTitle from '../components/landing/title';
import LandingIconFeature from '../components/landing/icon-feature';
import LandingMaintainence from '../components/landing/maintainence';
import LandingProductLayout from '../components/landing/product-layout';
import LandingProductBlock from '../components/landing/product-block';

import headerLink from './images/header.png';
import featureIcon from './images/feature-icon.png';

const IndexPage = () => (
  <Layout>
    <Header
      logo={<MainLogo />}
      addon={(
        <LandingHeaderAddon
          main={(
            <React.Fragment>
              Data-Centric
              <br />
              Reactive Components
            </React.Fragment>
          )}
          additional="for Bootstrap and Material Design"
          imageLink={headerLink}
        />
      )}
    />
    <LandingProductLayout
      position="header"
    >
      <LandingProductBlock
        type="react"
        iconLink={featureIcon}
        title="React"
      />
      <LandingProductBlock
        type="vue"
        iconLink={featureIcon}
        title="Vue"
      />
    </LandingProductLayout>
    <LandingLayout>
      <LandingTitle
        text="Why DevExtreme Reactive?"
      />
      <LandingIconFeature
        iconLink={featureIcon}
        title="Native Bootstrap Rendering"
        description="DevExtreme Reactive components deeply integrate with Bootstrap 4 CSS framework. Take advantage of Bootstrap semantic rendering and apply Bootstrap themes automatically."
      />
      <LandingIconFeature
        iconLink={featureIcon}
        title="Plugin-based Architecture"
        description="DevExtreme Reactive Components are build of plugins. Add and deploy only the features you need or extend the build-in functionality with your or third-party custom plugins."
      />
      <LandingIconFeature
        iconLink={featureIcon}
        title="Outstanding Performance"
        description="No matter whether your target React or Vue, our components use performance best practises of both. Be confident you'll get 100% possible speed."
      />
      <LandingIconFeature
        iconLink={featureIcon}
        title="Shared Code"
        description="Having React and Vue specific rendering layers our components share there code implementation. This reduces the number of bugs and allows us to ship new features faster."
      />
      <LandingIconFeature
        iconLink={featureIcon}
        title="TypeScript Support"
        description="TypeScript is usually the choice for enterprise-scale web applications. Our TypeScript definitions are autogenerated and are always complete and in sync with the docs."
      />
      <LandingIconFeature
        iconLink={featureIcon}
        title="Localization Capabilities"
        description="Every text element of the components UI is customizable. So, it's ready for localization or globalization if you need it in your app."
      />
      <LandingIconFeature
        iconLink={featureIcon}
        title="Simple Docs with Live Examples"
        description="Every component has a complete API reference and a usage guide with code examples and live demos with source avaliable on GitHub."
      />
    </LandingLayout>
    <LandingMaintainence />
    <LandingProductLayout
      position="footer"
    >
      <LandingProductBlock
        type="react"
        iconLink={featureIcon}
        title="React"
      />
      <LandingProductBlock
        type="vue"
        iconLink={featureIcon}
        title="Vue"
      />
    </LandingProductLayout>
  </Layout>
);

export default IndexPage;
