import * as React from 'react';
import { PluginHost as PluginHostCore } from '@devexpress/dx-core/dist/internal';
import { PluginIndexer } from './plugin-indexer';
import { TemplatePlaceholder } from './template-placeholder';
import { PluginHostContext } from './contexts';

type PluginHostProps = {
  /** Plugin React elements. */
  children?: React.ReactNode;
};

export class PluginHost extends React.PureComponent<PluginHostProps> {
  /** @internal */
  host: PluginHostCore;

  /** @internal */
  constructor(props) {
    super(props);

    this.host = new PluginHostCore();
  }

  /** @internal */
  render() {
    const { children } = this.props;

    return (
      <PluginHostContext.Provider value={this.host}>
        <PluginIndexer>
          {children}
        </PluginIndexer>
        <TemplatePlaceholder name="root" />
      </PluginHostContext.Provider>
    );
  }
}
