import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import {
  TabContent, TabPane, Nav, NavItem, NavLink,
} from 'reactstrap';

import { ThemeViewer } from './theme-viewer';
import { DemoFrame } from './demo-frame';
import { SourceCode } from './source-code';
import { EmbeddedDemoContext } from '../context';
import { DemoCodeProvider } from './demo-code-provider';
import { CodeSandBoxButton } from './codesandbox-button';
import './demo-viewer.css';

export class DemoViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 'preview',
    };

    this.toggle = this.toggle.bind(this);
    this.getEditorInstance = this.getEditorInstance.bind(this);
    this.editorInstance = null;
  }

  componentDidUpdate() {
    const { activeTab } = this.state;
    if (activeTab === 'source') {
      this.editorInstance.refresh();
    }
  }

  getEditorInstance(instance) {
    this.editorInstance = instance;
  }

  toggle(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { match: { params: { demoName, sectionName }, url } } = this.props;
    const { activeTab } = this.state;

    return (
      <EmbeddedDemoContext.Consumer>
        {({ showThemeSelector, demoSources, themeComponents, demoData }) => (
          <Switch>
            <Route
              path={`${url}/:themeName/:variantName/clean`}
              render={({ match: { params: { themeName, variantName } } }) => (
                <div>
                  <DemoCodeProvider
                    themeName={themeName}
                    variantName={variantName}
                    sectionName={sectionName}
                    demoName={demoName}
                  >
                    {({ html }) => (
                      <DemoFrame
                        themeName={themeName}
                        variantName={variantName}
                        sectionName={sectionName}
                        demoName={demoName}
                        markup={html}
                      />
                    )}
                  </DemoCodeProvider>
                </div>
              )}
            />
            <Route
              path={url}
              render={() => (
                <div style={{ paddingTop: '8px' }}>
                  <ThemeViewer
                    availableThemes={Object.keys(demoSources[sectionName][demoName])}
                  >
                    {({ themeName, variantName }) => (
                      <DemoCodeProvider
                        themeName={themeName}
                        variantName={variantName}
                        sectionName={sectionName}
                        demoName={demoName}
                      >
                        {({ html, code, helperFiles }) => (
                          <div style={{ marginTop: showThemeSelector ? '-42px' : 0 }}>
                            <Nav tabs>
                              <NavItem>
                                <NavLink
                                  tag="span"
                                  className={activeTab === 'preview' ? 'active' : ''}
                                  onClick={() => { this.toggle('preview'); }}
                                >
                                  Preview
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <NavLink
                                  tag="span"
                                  className={activeTab === 'source' ? 'active' : ''}
                                  onClick={() => { this.toggle('source'); }}
                                >
                                  Source
                                </NavLink>
                              </NavItem>
                              <NavItem>
                                <CodeSandBoxButton
                                  code={code}
                                  html={html}
                                  helperFiles={helperFiles}
                                  sectionName={sectionName}
                                  demoName={demoName}
                                  themeName={themeName}
                                />
                              </NavItem>
                            </Nav>
                            <TabContent
                              activeTab={activeTab}
                              style={{ marginTop: '20px' }}
                            >
                              <TabPane tabId="preview">
                                <DemoFrame
                                  themeName={themeName}
                                  variantName={variantName}
                                  sectionName={sectionName}
                                  demoName={demoName}
                                  markup={html}
                                />
                              </TabPane>
                              <TabPane tabId="source">
                                <SourceCode
                                  themeName={themeName}
                                  sectionName={sectionName}
                                  demoName={demoName}
                                  getEditorInstance={this.getEditorInstance}
                                  source={code}
                                />
                              </TabPane>
                            </TabContent>
                          </div>
                        )}
                      </DemoCodeProvider>
                    )}
                  </ThemeViewer>
                </div>
              )}
            />
          </Switch>
        )}
      </EmbeddedDemoContext.Consumer>
    );
  }
}

DemoViewer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      sectionName: PropTypes.string.isRequired,
      demoName: PropTypes.string.isRequired,
    }),
    url: PropTypes.string.isRequired,
  }).isRequired,
};
