import { Clarifications } from '@epgu/epgu-constructor-types';
import { FileUploadAttributes, FileUploadItem } from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import GenericAttrs from '../../component-list-resolver/GenericAttrs';

export default class FileUploadModelAttrs extends GenericAttrs {
  readonly clarifications: Clarifications;
  readonly uploads: FileUploadItem[];
  readonly uploadId?: string;
  readonly maxSize?: number;
  readonly maxFileCount?: number;
  readonly minFileCount?: number;
  readonly hideTotalAvailableSize?: boolean;
  readonly hideTotalAvailableCount?: boolean;

  constructor(attrs: FileUploadAttributes) {
    super(attrs);
    this.clarifications = attrs.clarifications;
    this.uploads = attrs.uploads;
    this.uploadId = attrs.uploadId;
    this.maxSize = attrs.maxSize;
    this.maxFileCount = attrs.maxFileCount;
    this.minFileCount = attrs.minFileCount;
    this.hideTotalAvailableSize = attrs.hideTotalAvailableSize;
    this.hideTotalAvailableCount = attrs.hideTotalAvailableCount;
  }
}
