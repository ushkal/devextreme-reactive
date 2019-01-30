import * as React from 'react';
import { getMessagesFormatter } from '@devexpress/dx-core';
import {
  Template, TemplatePlaceholder, Plugin, TemplateConnector, withComponents, PluginComponents,
  Getters, Actions,
} from '@devexpress/dx-react-core';
import {
  groupingPanelItems,
  getColumnSortingDirection,
} from '@devexpress/dx-grid-core';
import { GroupPanelLayout as Layout } from '../components/group-panel-layout';
import { GroupingPanelProps } from '../types';

const defaultMessages = {
  groupByColumn: 'Drag a column header here to group by that column',
};

class GroupingPanelRaw extends React.PureComponent<GroupingPanelProps> {
  static components: PluginComponents;

  render() {
    const {
      layoutComponent: LayoutComponent,
      containerComponent: Container,
      itemComponent: Item,
      emptyMessageComponent: EmptyMessage,
      showSortingControls,
      showGroupingControls,
      messages,
    } = this.props;

    const getMessage = getMessagesFormatter({ ...defaultMessages, ...messages });

    const EmptyMessagePlaceholder = () => (
      <EmptyMessage
        getMessage={getMessage}
      />
    );

    const ItemPlaceholder = ({ item }) => {
      const { name: columnName } = item.column;

      return (
        <TemplateConnector>
          {(
            { sorting, isColumnSortingEnabled, isColumnGroupingEnabled },
            { changeColumnGrouping, changeColumnSorting },
          ) => {
            const sortingEnabled = isColumnSortingEnabled && isColumnSortingEnabled(columnName);
            const groupingEnabled = isColumnGroupingEnabled && isColumnGroupingEnabled(columnName);

            return (
              <Item
                item={item}
                sortingEnabled={sortingEnabled}
                groupingEnabled={groupingEnabled}
                showSortingControls={showSortingControls!}
                sortingDirection={showSortingControls
                  ? getColumnSortingDirection(sorting, columnName)! : undefined}
                showGroupingControls={showGroupingControls!}
                onGroup={() => changeColumnGrouping({ columnName })}
                onSort={(
                  { direction, keepOther },
                ) => changeColumnSorting({ columnName, direction, keepOther })}
              />
            );
          }}
        </TemplateConnector>
      );
    };

    return (
      <Plugin
        name="GroupingPanel"
        dependencies={[
          { name: 'GroupingState' },
          { name: 'Toolbar' },
          { name: 'SortingState', optional: !showSortingControls },
        ]}
      >
        <Template name="toolbarContent">
          <TemplateConnector>
            {({
              columns, grouping, draftGrouping, draggingEnabled, isColumnGroupingEnabled,
            }: Getters, {
              changeColumnGrouping, draftColumnGrouping, cancelColumnGroupingDraft,
            }: Actions) => (
              <LayoutComponent
                items={groupingPanelItems(columns, grouping, draftGrouping)}
                isColumnGroupingEnabled={isColumnGroupingEnabled}
                draggingEnabled={draggingEnabled}
                onGroup={changeColumnGrouping}
                onGroupDraft={draftColumnGrouping}
                onGroupDraftCancel={cancelColumnGroupingDraft}
                itemComponent={ItemPlaceholder}
                emptyMessageComponent={EmptyMessagePlaceholder}
                containerComponent={Container}
              />
            )}
          </TemplateConnector>
          <TemplatePlaceholder />
        </Template>
      </Plugin>
    );
  }
}

GroupingPanelRaw.components = {
  layoutComponent: 'Layout',
  containerComponent: 'Container',
  itemComponent: 'Item',
  emptyMessageComponent: 'EmptyMessage',
};

// tslint:disable-next-line: max-line-length
export const GroupingPanel: React.ComponentType<GroupingPanelProps> = withComponents({ Layout })(GroupingPanelRaw);