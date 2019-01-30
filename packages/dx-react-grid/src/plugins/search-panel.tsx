import * as React from 'react';
import { getMessagesFormatter } from '@devexpress/dx-core';
import {
  Template,
  TemplatePlaceholder,
  Plugin,
  TemplateConnector,
  PluginComponents,
} from '@devexpress/dx-react-core';
import { SearchPanelProps } from '../types';

const pluginDependencies = [
  { name: 'Toolbar' },
  { name: 'SearchState' },
];

const defaultMessages = {
  searchPlaceholder: 'Search...',
};

class SearchPanelBase extends React.PureComponent<SearchPanelProps> {
  static components: PluginComponents;

  render() {
    const { inputComponent: Input, messages } = this.props;
    const getMessage = getMessagesFormatter({ ...defaultMessages, ...messages });

    return (
      <Plugin
        name="SearchPanel"
        dependencies={pluginDependencies}
      >
        <Template name="toolbarContent">
          <TemplatePlaceholder />
          <TemplateConnector>
            {({ searchValue }, { changeSearchValue }) => (
              <Input
                value={searchValue}
                onValueChange={changeSearchValue}
                getMessage={getMessage}
              />
            )}
          </TemplateConnector>
        </Template>
      </Plugin>
    );
  }
}

SearchPanelBase.components = {
  inputComponent: 'Input',
};

export const SearchPanel: React.ComponentType<SearchPanelProps> = SearchPanelBase;