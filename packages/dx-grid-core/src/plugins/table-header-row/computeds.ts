import { TABLE_HEADING_TYPE } from './constants';
import { Computed } from '@devexpress/dx-core';
import { TableRows } from '../../types';

export const tableRowsWithHeading: Computed<TableRows> = headerRows => [
  { key: TABLE_HEADING_TYPE.toString(), type: TABLE_HEADING_TYPE },
  ...headerRows];
