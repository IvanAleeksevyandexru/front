import BaseModel from '../../component-list-resolver/BaseModel';
import { CustomScreenComponentTypes } from '../../components-list.types';
import FileUploadModelAttrs from './FileUploadModelAttrs';

export default class FileUploadModel extends BaseModel<FileUploadModelAttrs> {
  type = CustomScreenComponentTypes.FileUploadComponent;

  getAttrs(attrs: FileUploadModelAttrs): FileUploadModelAttrs {
    return new FileUploadModelAttrs(attrs);
  }
}
