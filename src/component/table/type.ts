import { ColumnType } from 'rc-table/lib/interface';

export interface ColumnConfigItem extends ColumnType<any> {
  dictType?: string;
  placeHolder?: string;
}
