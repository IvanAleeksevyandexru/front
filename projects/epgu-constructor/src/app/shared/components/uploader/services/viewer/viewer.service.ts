import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { ModalService } from '../../../../../modal/modal.service';
import { UploaderViewerComponent } from '../../components/uploader-viewer/uploader-viewer.component';
import { FileItem } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

import { SudjectAction } from '../../data';

@Injectable()
export class ViewerService {
  delete = new EventEmitter<FileItem>();
  download = new EventEmitter<FileItem>();
  sudjest = new EventEmitter<SudjectAction>();

  constructor(private modal: ModalService) {}

  open(index: number, files: FileItem[], isSudject: boolean, sudjects: FileItem[] = []): void {
    const component = this.modal.openModal(
      UploaderViewerComponent,
      {
        isSudject,
        files,
        sudjects,
        index,
      },
      true,
    ) as ComponentRef<UploaderViewerComponent>;
    console.log(component);
  }
}
