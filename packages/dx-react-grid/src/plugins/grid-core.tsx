import * as React from 'react';
import {
  Plugin, Getter, Template, TemplatePlaceholder, Getters,
} from '@devexpress/dx-react-core';
import { rowIdGetter, cellValueGetter } from '@devexpress/dx-grid-core';
import { GridProps } from '../types';

class GridCoreBase extends React.PureComponent<GridProps> {
  render() {
    const {
      rows,
      columns,
      getRowId,
      getCellValue,
      rootComponent: Root,
    } = this.props;

    const rowIdGetterComputed = ({
      rows: getterRows,
    }: Getters) => rowIdGetter(getRowId!, getterRows);

    return (
      <Plugin>
        <Getter name="start" value={0} />
        <Getter name="loadedRowsStart" value={0} />
        <Getter name="totalRowCount" value={rows.length} />
        <Getter name="rows" value={rows} />
        {/* <Getter name="getRowId" computed={rowIdGetterComputed} /> */}
        <Getter name="getRowId" value={rowIdGetter(getRowId!, rows)} />
        <Getter name="columns" value={columns} />
        <Getter name="getCellValue" value={cellValueGetter(getCellValue!, columns)} />
        <Template name="root">
          <Root>
            <TemplatePlaceholder name="header" />
            <TemplatePlaceholder name="body" />
            <TemplatePlaceholder name="footer" />
          </Root>
        </Template>
      </Plugin>
    );
  }
}

export const GridCore: React.ComponentType<GridProps> = GridCoreBase;