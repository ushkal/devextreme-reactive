import * as React from 'react';
import Helmet from 'react-helmet';
import Layout from '../../../components/layout';
import Header from '../../../components/header';
import ProductLogo from '../../../components/logos/product';
import LandingHeaderAddon from '../../../components/landing/header-addon';
import LandingMaintainence from '../../../components/landing/maintainence';
import LandingLink from '../../../components/landing/link';
import LandingReadyToLearnMore from '../../../components/landing/ready-to-learn-more';
import LandingChessBoardLayoutList from '../../../components/landing/features-list';
import LandingChessBoardSmallLayoutList from '../../../components/landing/features-list-small';
import imageBoxLink from '../../images/image-box.png';
import smallImageBoxLink from '../../images/image-box-small.png';
import headerLink from './images/header.png';

import LandingIconFeature from '../../../components/landing/icon-feature';
import LandingLayout from '../../../components/landing/layout';
import LandingTitle from '../../../components/landing/title';
import LandingImageFeature from '../../../components/landing/image-feature';
import bootstrapThemeLink from './images/bootstrap-theme.png';
import materialThemeLink from './images/material-theme.png';

const chartTypes = [
  {
    title: 'Bar',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Line',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Spline',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Area',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Scatter',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Stacked Bar',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Stacked Line',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Stacked Spline',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Stacked Area',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
  {
    title: 'Pie',
    imageLink: smallImageBoxLink,
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG.',
  },
];
const pageData = [
  {
    reversed: true,
    sectionTitle: 'Interactivity At Your Full Control',
    title: 'Series/Point Selection',
    description: 'React Chart supports both programmatic and interactive series/point selection. The selected elements can be automatically highlighted and the associated data is exposed to your application for use. The both single and multiple selection are supported.',
    imageLink: imageBoxLink,
  },
  {
    alternative: true,
    title: 'Series/Point Hover & Event Tracking',
    description: 'Hover Tracking allows you to know which series or point is hovered and reflect this information in your application UI. For instance, you can show a point details in a separate or popup form. You can also track and handle other series/point mouse/touch events.',
    imageLink: imageBoxLink,
  },
  {
    reversed: true,
    title: 'Zooming and Scrolling',
    description: 'End-users can effeciently analyse long point series using the React Chart zooming and scrolling capabilities. We support instant zooming using mouse wheel or zoom gestures and zoom to a square region. Horizontal scrolling/panning is also available.',
    imageLink: imageBoxLink,
  },
  {
    alternative: true,
    sectionTitle: 'Wide Customization Capabilities',
    title: 'Customize Chart via HTML/CSS',
    description: 'The React Chart uses a hybrid rendering mechanism that combines HTML and SVG. This means that you can use HTML and CSS to influence layout and appearance of chart building blocks such as title and legend.',
    imageLink: imageBoxLink,
  },
  {
    reversed: true,
    title: 'Enhance Charts Using D3',
    description: 'You can use the existing D3 modules to apply different kinds of custom chart behavior or data visualization. Explore our online React Chart demos and learn how we utilize the d3-scale, d3-shape, d3-format and other D3 modules.',
    imageLink: imageBoxLink,
  },
  {
    alternative: true,
    title: 'Customize Chart Rendering',
    description: 'The React Chart UI plugins allow you to use custom React components to render particular pieces of the React Chart UI in a custom way. All you need is to pass your custom components to the required plugins via their props.',
    imageLink: imageBoxLink,
  },
];

const IndexPage = () => (
  <Layout>
    <Helmet title="React Chart" />
    <Header
      logo={<ProductLogo link="react/chart" />}
      addon={(
        <LandingHeaderAddon
          main="React Chart"
          additional={(
            <React.Fragment>
              for Bootstrap and Material-UI
              <br />
              <br />
              <LandingLink
                to="/react/chart/docs/guides/getting-started/"
                variant="button"
                title="Getting Started"
              >
                Getting Started
              </LandingLink>
              {' '}
              <LandingLink
                to="/react/chart/demos/"
                type="react"
                variant="button"
                title="Demos"
              >
                Demos
              </LandingLink>
            </React.Fragment>
          )}
          imageLink={headerLink}
        />
      )}
    />
    <div className="mt-3"/>
    <LandingChessBoardSmallLayoutList data={chartTypes} />
    <LandingChessBoardLayoutList data={pageData} columns={3} />
    <LandingLayout>
      <LandingTitle text="Native Support for the UI Library of Your Choice" />
      <LandingImageFeature
        imageLink={bootstrapThemeLink}
        title="Twitter Bootstrap Rendering"
        description="Use any existing or create your custom bootstrap theme. No need for any additional configuration."
      />
      <LandingImageFeature
        imageLink={materialThemeLink}
        title="Material Design Rendering"
        description="We ship additional Material-UI packages that allow you to utilize the familiar approaches and appearance."
      />
    </LandingLayout>
    <LandingLayout>
      <LandingTitle text="And Things That Also Matter..." />
    </LandingLayout>

    <LandingLayout>
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
    </LandingLayout>

    <LandingMaintainence />
    <LandingReadyToLearnMore
      links={(
        <React.Fragment>
          <LandingLink
            to="/react/chart/docs/guides/getting-started/"
            variant="button"
            title="Getting Started"
          >
            Getting Started
          </LandingLink>
          {' '}
          <LandingLink
            to="/react/chart/demos/"
            type="react"
            variant="button"
            title="Demos"
          >
            Demos
          </LandingLink>
        </React.Fragment>
      )}
    />
  </Layout>
);

export default IndexPage;
