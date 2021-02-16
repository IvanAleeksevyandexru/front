import { FileItem } from '../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

export const iconsTypes = {
  doc: 'DOC',
  docx: 'DOC',
  jpg: 'JPG',
  jpeg: 'JPG',
  bmp: 'BMP',
  csv: 'CSV',
  flv: 'FLV',
  gif: 'GIF',
  key: 'KEY',
  mov: 'MOV',
  mpg: 'MPG',
  pdf: 'PDF',
  png: 'PNG',
  ppt: 'PPT',
  rar: 'RAR',
  rtf: 'RTF',
  sig: 'SIG',
  tif: 'TIF',
  tiff: 'TIF',
  txt: 'TXT',
  xls: 'XLS',
  xml: 'XML',
  zip: 'ZIP',
};

export interface SuggestAction {
  file: FileItem;
  isAdd: boolean;
}
