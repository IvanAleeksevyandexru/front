import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { first, mapTo, startWith, take, takeUntil } from 'rxjs/operators';
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
  prefixForMnemonic$: Observable<string>;
  files: FileUploadEmitValue[] = [];

  constructor(
    public injector: Injector,
    public screenService: ScreenService,
    private eventBusService: EventBusService,
  ) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.prefixForMnemonic$ = this.control.valueChanges.pipe(
      take(1),
      mapTo(`${this.control.value.id}.FileUploadComponent`),
    );

    combineLatest([
      this.control.valueChanges.pipe(first(), startWith('')),
      this.eventBusService.on('fileUploadValueChangedEvent'),
    ])
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(([, uploads]) => this.updateParentForm(uploads));
  }

  private updateParentForm(uploads: FileResponseToBackendUploadsItem): void {
    this.handleNewValueSet(uploads);
    this.control.get('value').setValue({ uploads: this.files });
    if (!this.isValid()) {
      this.control.get('value').setErrors({ required: true });
    }
    this.formService.emitChanges();
  }

  // @TODO разобраться с relatedUploads и required
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
      const relatedUpload: FileUploadEmitValue = this.files.find(
        (value: FileUploadEmitValue) => value.relatedUploads,
      );

      this.files = $eventData.files.map((value: FileUploadEmitValue) => {
        if (relatedUpload && value?.uploadId === relatedUpload.uploadId) {
          return { ...value, relatedUploads: relatedUpload.relatedUploads };
        }
        return value;
      });
    }
  }

  private isValid(): boolean {
    return (
      this.isValidMinFileOrRequired() && this.isValidMaxFileSize() && this.isValidMaxFileCount()
    );
  }

  private isValidMinFileOrRequired(): boolean {
    const { minFileCount } = this.control.value.attrs as FileUploadAttributes;
    const uploadedFileCount = this.getUploadedFiles().length;
    if (minFileCount) {
      return uploadedFileCount >= minFileCount;
    }
    const requiredUploads = this.files.filter((uploader) => uploader.required);
    return uploadedFileCount >= requiredUploads.length;
  }

  private isValidMaxFileSize(): boolean {
    const { maxSize } = this.control.value.attrs as FileUploadAttributes;
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
    const { maxFileCount } = this.control.value.attrs as FileUploadAttributes;
    if (maxFileCount) {
      const uploadedFileCount = this.getUploadedFiles().length;
      return maxFileCount >= uploadedFileCount;
    }
    return true;
  }

  private getUploadedFiles(): TerraUploadedFile[] {
    return _flatten(this.files.map(({ value }) => value.filter((file) => file.uploaded)));
  }
}
