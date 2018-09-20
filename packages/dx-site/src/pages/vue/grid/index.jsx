import * as React from 'react';
import Layout from '../../../components/layout';
import Header from '../../../components/header';
import MainLogo from '../../../components/logos/main';
import LandingHeaderAddon from '../../../components/langing-header-addon';

import indexHeader from './index-header.png';

const IndexPage = () => (
  <Layout>
    <Header
      logo={<MainLogo />}
      addon={(
        <LandingHeaderAddon
          main="Vue Grid"
          additional="for Bootstrap"
          imageLink={indexHeader}
        />
      )}
    />
  </Layout>
);

export default IndexPage;
