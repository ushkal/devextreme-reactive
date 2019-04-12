import * as React from 'react';
import { RefHolder } from '@devexpress/dx-react-core';
import { ColumnGroup } from './column-group';

export class VirtualTableLayoutBlock extends React.PureComponent<any, any> {
  constructor(props) {
    super(props);


  }

  render() {
    const {
      minWidth,
      blockRefsHandler = () => {},
      rowRefsHandler = () => {},
      name,
      collapsedGrid,
      Table,
      Body,
      blockRef?,
      marginBottom?,
      bodyHeight?
    } = this.props;
    const Row = this.props.rowComponent as React.ComponentType<any>;
    const Cell = this.props.cellComponent as React.ComponentType<any>;

    const tableRef = blockRef || React.createRef();

    return (
      <RefHolder
        ref={ref => blockRefsHandler(name, ref)}
      >
        <Table
          tableRef={tableRef}
          style={{
            minWidth: `${minWidth}px`,
            ...marginBottom ? { marginBottom: `${marginBottom}px` } : null,
          }}
        >
          <ColumnGroup
            columns={collapsedGrid.columns}
          />
          <Body>
            {collapsedGrid.rows.map((visibleRow) => {
              const { row, cells = [] } = visibleRow;

              return (
                <RefHolder
                  key={row.key}
                  ref={ref => rowRefsHandler(row, ref)}
                >
                  <Row
                    tableRow={row}
                    style={row.height !== undefined
                      ? { height: `${(row.height === 'auto' ? bodyHeight : row.height)}px` }
                      : undefined}
                  >
                    {cells.map((cell) => {
                      const { column } = cell;
                      return (
                        <Cell
                          key={column.key}
                          tableRow={row}
                          tableColumn={column}
                          style={column.animationState}
                          colSpan={cell.colSpan}
                        />
                      );
                    })}
                  </Row>
                </RefHolder>
              );
            })}
          </Body>
        </Table>
      </RefHolder>
    );
  }

}
