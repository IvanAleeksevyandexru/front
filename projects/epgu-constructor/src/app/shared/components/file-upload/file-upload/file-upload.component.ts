import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import {
  FileResponseToBackendUploadsItem,
  FileUploadAttributes,
  FileUploadItem,
} from '../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'epgu-constructor-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit {
  @Input() objectId: string;
  @Input() prefixForMnemonic: string;
  @Input() uploadId: string = null;
  @Input()
  set attributes(attrs: FileUploadAttributes) {
    this.attrs = attrs;
    this.value.files = this.fillUploadsDefaultValue();
    this.eventBusService.emit('fileUploadValueChangedEvent', this.value);
  }
  get attributes(): FileUploadAttributes {
    return this.attrs;
  }

  private attrs: FileUploadAttributes;
  private value: FileResponseToBackendUploadsItem = { files: [], errors: [] };

  constructor(
    private fileUploadService: FileUploadService,
    private ngUnsubscribe$: UnsubscribeService,
    private eventBusService: EventBusService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setUploadersRestrictions();

    this.eventBusService
      .on('fileUploadItemValueChangedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileResponseToBackendUploadsItem) => {
        this.handleNewValueForItem(payload);
        this.cdr.markForCheck();
      });
  }

  getFiles(): FileResponseToBackendUploadsItem[] {
    return this.value?.files;
  }

  setUploadersRestrictions(): void {
    this.setTotalMaxSizeAndAmount(this.attrs.maxSize, this.attrs.maxFileCount);

    this.attrs.uploads?.forEach(({ uploadId, maxFileCount, maxSize }: FileUploadItem) =>
      this.fileUploadService.registerUploader(uploadId, maxFileCount, maxSize),
    );
  }

  setTotalMaxSizeAndAmount(maxSize: number, maxAmount: number): void {
    if (maxSize) {
      this.fileUploadService.setTotalMaxSize(maxSize);
    }
    if (maxAmount) {
      this.fileUploadService.setTotalMaxAmount(maxAmount);
    }
  }

  /**
   * Возвращает префикс для формирования мнемоники
   * @param ref - секция ref из секции relatedUpload
   */
  getUploadComponentPrefixForMnemonic(ref: string): string {
    return [this.prefixForMnemonic, ref].join('.');
  }

  /**
   * Обрабатывает новое значение от формы загрузки
   * @param $eventData - новые значения от формы
   */
  handleNewValueForItem($eventData: FileResponseToBackendUploadsItem): void {
    this.value.files = this.value.files.map((valueItem: FileResponseToBackendUploadsItem) => {
      const value = { ...valueItem };
      if (valueItem.uploadId === $eventData.uploadId) {
        value.value = $eventData.value;
        value.required = $eventData.required;
      }
      return value;
    });
    this.value.errors = $eventData.errors;

    this.eventBusService.emit('fileUploadValueChangedEvent', this.value);
  }

  /**
   * Заполняем значения по умолчанию для возврата на сервер
   * @private
   */
  private fillUploadsDefaultValue(): FileResponseToBackendUploadsItem[] {
    const value: FileResponseToBackendUploadsItem[] = [];
    this.attrs?.uploads?.forEach((upload: FileUploadItem) => {
      const newValue: FileResponseToBackendUploadsItem = {
        uploadId: upload.uploadId,
        value: [],
      };
      value.push(newValue);
    });
    return value;
  }
}
