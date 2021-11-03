import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Clarifications } from '@epgu/epgu-constructor-types';
import { UploaderManagerService } from '../services/manager/uploader-manager.service';
import { UploaderStoreService } from '../services/store/uploader-store.service';
import { UploaderStatService } from '../services/stat/uploader-stat.service';
import { UploadContext } from '../data';
import { UploadedFile } from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { UploaderValidationService } from '../services/validation/uploader-validation.service';
import { UploaderProcessService } from '../services/process/uploader-process.service';

@Component({
  selector: 'epgu-constructor-file-upload-container',
  templateUrl: './file-upload-container.component.html',
  styleUrls: ['./file-upload-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    UploaderStoreService,
    UploaderValidationService,
    UploaderManagerService,
    UploaderProcessService,
    UploaderStatService,
  ],
})
export class FileUploadContainerComponent {
  files = new BehaviorSubject<UploadedFile[]>(null);
  galleryFiles = new BehaviorSubject<UploadedFile[]>(null);
  files$ = this.files.pipe(filter((status) => status !== null));
  galleryFiles$ = this.galleryFiles.pipe(filter((status) => status !== null));
  clarifications: Clarifications;
  @Input() set upload({
    objectId,
    prefixForMnemonic,
    data,
    files,
    galleryFiles,
    clarifications,
  }: UploadContext) {
    this.stat.reset();
    this.store.reset();
    this.uploader.objectId = objectId;
    this.uploader.prefixForMnemonic = prefixForMnemonic;
    this.uploader.data = { ...data };
    this.files.next([...files]);
    this.galleryFiles.next(
      galleryFiles.filter((file: UploadedFile) => file.uploadId === data.uploadId),
    );
    this.clarifications = clarifications;
  }
  constructor(
    private uploader: UploaderManagerService,
    private store: UploaderStoreService,
    private stat: UploaderStatService,
  ) {}
}
