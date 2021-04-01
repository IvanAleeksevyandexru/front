import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { first, startWith, takeUntil } from 'rxjs/operators';
import { flatten as _flatten } from 'lodash';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { ScreenService } from '../../../../screen/screen.service';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import {
  FileResponseToBackendUploadsItem,
  FileUploadAttributes,
  FileUploadEmitValue,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { TerraUploadedFile } from '../../../../shared/components/file-upload/file-upload-item/data';

@Component({
  selector: 'epgu-constructor-file-upload-form',
  templateUrl: './file-upload-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class FileUploadFormComponent extends AbstractComponentListItemComponent implements OnInit {
  files: FileUploadEmitValue[];
  constructor(
    public injector: Injector,
    public screenService: ScreenService,
    private eventBusService: EventBusService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    combineLatest([
      this.control.valueChanges.pipe(first(), startWith('')),
      this.eventBusService.on('fileUploadValueChangedEvent'),
    ])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([, uploads]) => this.updateParentForm(uploads));
  }

  updateParentForm(uploads: FileResponseToBackendUploadsItem): void {
    this.handleNewValueSet(uploads);
    this.control.get('value').setValue({ uploads: this.files });
    if (!this.isValid()) {
      this.control.get('value').setErrors({ required: true });
    }
    this.formService.emitChanges();
  }

  // @TODO разобраться с relatedUploads и подумать над required
  private handleNewValueSet($eventData: FileResponseToBackendUploadsItem): void {
    if ($eventData.relatedUploads) {
      this.files = this.files.map((value: FileUploadEmitValue) => {
        if ($eventData.uploadId === value.uploadId) {
          return {
            ...value,
            relatedUploads: $eventData.relatedUploads,
            required: $eventData.required,
          } as FileUploadEmitValue;
        }
        return value;
      });
    } else {
      const relatedUpload: FileUploadEmitValue = this.files?.find(
        (value: FileUploadEmitValue) => value?.relatedUploads,
      );

      this.files = $eventData.files?.map((value: FileUploadEmitValue) => {
        let resultValue = value;
        if (relatedUpload && value?.uploadId === relatedUpload.uploadId) {
          resultValue = { ...value, relatedUploads: relatedUpload.relatedUploads };
        }
        return resultValue;
      });
    }
  }

  private isValid(): boolean {
    return this.isValidMinFileCount() && this.isValidMaxFileSize() && this.isValidMaxFileCount();
  }

  private isValidMinFileCount(): boolean {
    const { minFileCount = 0 } = this.control.value.attrs as FileUploadAttributes;
    const uploadedFiles = this.getUploadedFiles().length;
    return uploadedFiles >= minFileCount;
  }

  private isValidMaxFileSize(): boolean {
    const { maxSize } = this.control.value.attrs as FileUploadAttributes;
    const uploadedFileSize = this.getUploadedFiles().reduce(
      (count, { fileSize }) => count + fileSize,
      0,
    );
    return maxSize >= uploadedFileSize;
  }

  private isValidMaxFileCount(): boolean {
    const { maxFileCount } = this.control.value.attrs as FileUploadAttributes;
    const uploadedFileCount = this.getUploadedFiles().length;
    return maxFileCount >= uploadedFileCount;
  }

  private getUploadedFiles(): TerraUploadedFile[] {
    return _flatten(this.files.map(({ value }) => value.filter((file) => file.uploaded)));
  }
}
