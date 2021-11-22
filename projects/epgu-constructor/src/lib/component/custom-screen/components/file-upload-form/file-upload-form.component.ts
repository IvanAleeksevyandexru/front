import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { first, startWith, takeUntil } from 'rxjs/operators';
import { flatten as _flatten } from 'lodash';

import { UnsubscribeService, EventBusService, BusEventType } from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ScreenService } from '../../../../screen/screen.service';
import {
  FileResponseToBackendUploadsItem,
  FileUploadEmitValue,
  UploadedFile,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { UploaderScreenService } from '../../../../shared/components/file-upload/services/screen/uploader-screen.service';
import FileUploadModelAttrs from './FileUploadModelAttrs';

@Component({
  selector: 'epgu-constructor-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  styleUrls: ['./file-upload-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService, UploaderScreenService],
})
export class FileUploadFormComponent
  extends AbstractComponentListItemComponent<FileUploadModelAttrs>
  implements OnInit {
  prefixForMnemonic: string;
  files: FileUploadEmitValue[] = [];

  constructor(
    public injector: Injector,
    public screenService: ScreenService,
    public uploaderScreenService: UploaderScreenService,
    private eventBusService: EventBusService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.uploaderScreenService.setValuesFromAttrs(this.attrs);
    this.prefixForMnemonic = `${this.control.value.id}.FileUploadComponent`;

    combineLatest([
      this.control.valueChanges.pipe(first(), startWith('')),
      this.eventBusService.on(BusEventType.FileUploadValueChangedEvent),
    ])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([, uploads]) => this.updateParentForm(uploads));
  }

  private updateParentForm(uploads: FileResponseToBackendUploadsItem): void {
    this.handleNewValueSet(uploads);
    this.control.get('value').setValue({
      uploads: this.files,
      totalCount: this.uploaderScreenService.getCurrentFilesCount(),
      totalSize: this.uploaderScreenService.getCurrentFilesSize(),
    });

    if (!this.isValid()) {
      this.control.get('value').setErrors({ required: true });
    }

    this.formService.emitChanges();
    this.uploaderScreenService.updateLimits();
    this.cdr.markForCheck();
  }

  // @TODO разобраться с relatedUploads и required
  private handleNewValueSet($eventData: FileResponseToBackendUploadsItem): void {
    this.files = $eventData.files as FileUploadEmitValue[];

    this.uploaderScreenService.calculateСurrentFiles(this.files);
  }

  private isValid(): boolean {
    return (
      this.isValidMinFileOrRequired() && this.isValidMaxFileSize() && this.isValidMaxFileCount()
    );
  }

  private isValidMinFileOrRequired(): boolean {
    const { minFileCount } = this.attrs;
    const uploadedFileCount = this.getUploadedFiles().length;

    if (minFileCount) {
      return uploadedFileCount >= minFileCount;
    }
    return this.isOptional() || !!uploadedFileCount;
  }

  private isOptional(): boolean {
    return !this.screenService.getComponentByIndex(this.componentIndex).required;
  }

  private isValidMaxFileSize(): boolean {
    const { maxSize } = this.attrs;
    if (maxSize) {
      const uploadedFileSize = this.getUploadedFiles().reduce(
        (count, { fileSize }) => count + fileSize,
        0,
      );
      return maxSize >= uploadedFileSize;
    }
    return true;
  }

  private isValidMaxFileCount(): boolean {
    const { maxFileCount } = this.attrs;
    if (maxFileCount) {
      const uploadedFileCount = this.getUploadedFiles().length;
      return maxFileCount >= uploadedFileCount;
    }
    return true;
  }

  private getUploadedFiles(): UploadedFile[] {
    return _flatten(this.files.map(({ value }) => value.filter((file) => file.uploaded)));
  }
}
