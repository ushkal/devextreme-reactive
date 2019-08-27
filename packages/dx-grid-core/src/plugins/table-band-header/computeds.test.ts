import { TABLE_BAND_TYPE } from './constants';
import { TABLE_DATA_TYPE } from '../table/constants';
import {
  tableRowsWithBands, tableHeaderColumnChainsWithBands, columnBandLevels, bandLevelsVisibility,
} from './computeds';
import { expandChainsCore } from '../table-fixed-columns/computeds.test';

describe('TableBandHeader Plugin computeds', () => {
  describe('#tableRowsWithBands', () => {
    const tableHeaderRows = [{}];
    it('should add zero band row if one nested level', () => {
      const columnBands = [{ title: 'title-a' }];
      const tableColumns = [{ type: TABLE_DATA_TYPE, column: { columnName: 'b' } }];
      const rows = tableRowsWithBands(tableHeaderRows, columnBands, tableColumns);

      expect(rows)
        .toEqual([{}]);
    });

    it('should add one band row if two nested levels', () => {
      const columnBands = [
        { title: 'title-a', children: [{ columnName: 'a' }, { columnName: 'b' }] },
      ];
      const tableColumns = [
        { type: TABLE_DATA_TYPE, column: { name: 'a' } },
        { type: TABLE_DATA_TYPE, column: { name: 'b' } },
      ];
      const rows = tableRowsWithBands(tableHeaderRows, columnBands, tableColumns);

      expect(rows)
        .toEqual([{ key: `${TABLE_BAND_TYPE.toString()}_0`, type: TABLE_BAND_TYPE, level: 0 }, {}]);
    });

    it('should add one band row if one nested level is hidden', () => {
      const columnBands = [
        {
          title: 'title-a',
          children: [
            { columnName: 'a' },
            { columnName: 'b' },
            {
              title: 'title-b',
              children: [{ columnName: 'd' }, { columnName: 'e' }],
            },
          ],
        },
        { columnName: 'c' },
      ];
      const tableColumns = [
        { type: TABLE_DATA_TYPE, column: { name: 'a' } },
        { type: TABLE_DATA_TYPE, column: { name: 'b' } },
        { type: TABLE_DATA_TYPE, column: { name: 'c' } },
      ];
      const rows = tableRowsWithBands(tableHeaderRows, columnBands, tableColumns);

      expect(rows)
        .toEqual([{ key: `${TABLE_BAND_TYPE.toString()}_0`, type: TABLE_BAND_TYPE, level: 0 }, {}]);
    });
  });

  describe('#tableHeaderColumnChainsWithBands', () => {
    const columns = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
    ].map(name => ({ column: { name }, key: name, type: TABLE_DATA_TYPE }));
    const bands = [
      {
        title: 'band A-0',
        children: [
          { columnName: 'a' },
          { columnName: 'b' },
          { columnName: 'c' },
          {
            title: 'Band B-0',
            children: [
              { columnName: 'c' },
              { columnName: 'd' },
            ],
          },
          {
            title: 'Band B-1',
            children: [
              { columnName: 'e' },
              { columnName: 'f' },
              {
                title: 'Band C-0',
                children: [
                  { columnName: 'f' },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'band A-1',
        children: [{ columnName: 'h' }],
      },
    ];
    const rows = [
      { key: 'band_0', type: TABLE_BAND_TYPE, level: 0 },
      { key: 'band_1', type: TABLE_BAND_TYPE, level: 1 },
      { key: 'band_2', type: TABLE_BAND_TYPE, level: 2 },
      { key: 'heading', type: 'heading' },
    ];
    const expandChains = rowChains => rowChains && expandChainsCore(
      rowChains,
      col => ({
        column: {
          name: col,
        },
      }),
    );
    const compressChains = chains => (
      chains.map(rowChains => (
        rowChains.map(chain => (
          chain.columns.map(col => col.column.name)
        ))
      ))
    );
    const assertChainsSplit = (
      expectedCompressedChains,
    ) => {
      const expectedChains = expandChains(expectedCompressedChains);

      const result = tableHeaderColumnChainsWithBands(
        rows, columns, bands,
      );
      const collapsedChains = compressChains(result);

      expect(collapsedChains).toMatchObject(expectedCompressedChains);
      expect(result).toMatchObject(expectedChains);
    };

    it('should split columns to band chains', () => {
      assertChainsSplit(
        [
          [['a', 'b', 'c', 'd', 'e', 'f'], ['g'], ['h'], ['i']],
          [['a', 'b'], ['c', 'd'], ['e', 'f'], ['g'], ['h'], ['i']],
          [['a', 'b'], ['c', 'd'], ['e'], ['f'], ['g'], ['h'], ['i']],
          [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']],
        ],
      );
    });
  });

  describe('#columnBandLevels', () => {
    it('should in simple case', () => {
      const bands = [{
        title: 'Band0',
        children: [{ columnName: 'a' }],
      }, {
        title: 'Band1',
        children: [{ columnName: 'b' }],
      }];

      expect(columnBandLevels(bands))
        .toEqual({
          Band0: 0,
          Band1: 0,
        });
    });

    it('should work with nested bands', () => {
      const bands = [{
        title: 'Band0',
        children: [{
          title: 'Band1',
          children: [{
            title: 'Band2',
            children: [{ columnName: 'a' }],
          }],
        }],
      }];

      expect(columnBandLevels(bands))
        .toEqual({
          Band0: 0,
          Band1: 1,
          Band2: 2,
        });
    });
  });

  fdescribe('#bandLevelsVisibility', () => {
    fit('should work when all columns are visible', () => {
      const viewport = {
        columns: [[0, 4]],
      };
      const columns = [{}, {}, {}, {}, {}];
      const headerColumnChains = [
        [
          { bandTitle: null, start: 0, columns: columns.slice(0, 0) },
          { bandTitle: 'Band1', start: 1, columns: columns.slice(1, 3) },
          { bandTitle: null, start: 4, columns: columns.slice(4, 4) },
        ],
        [
          { bandTitle: null, start: 0, columns: columns.slice(0, 0) },
          { bandTitle: 'Band1', start: 1, columns: columns.slice(1, 1) },
          { bandTitle: 'Nested band', start: 2, columns: columns.slice(2, 3) },
          { bandTitle: null, start: 4, columns: columns.slice(4, 4) },
        ],
        [
          { bandTitle: null, start: 0, columns },
        ],
      ];
      const bandLevels = {
        Band0: 0,
        'Nested band': 1,
      };

      expect(bandLevelsVisibility(viewport, headerColumnChains, bandLevels))
        .toEqual({});

    });
  });
});
