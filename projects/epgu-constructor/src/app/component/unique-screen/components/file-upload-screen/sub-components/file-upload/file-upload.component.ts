import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import {
  FileResponseToBackendUploadsItem,
  FileResponseToBackendWithRelatedUploads,
  FileUploadAttributes,
  FileUploadItem,
  FileUploadItemTypes,
} from '../../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { FileUploadService, Uploaders } from '../file-upload.service';

@Component({
  selector: 'epgu-constructor-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [UnsubscribeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileUploadComponent implements OnInit {
  @Input() objectId: string;
  @Input() isRelatedUploads = false;
  @Input() applicantAnswers: object;
  @Input() prefixForMnemonic: string;
  @Input() uploadId: string = null;
  @Input()
  set attributes(attrs: FileUploadAttributes) {
    this.attrs = attrs;
    if (attrs?.ref) {
      this.refData = this.getRefValuesForApplicantAnswers(attrs);
    }
    this.value.files = this.fillUploadsDefaultValue();
    this.eventBusService.emit('fileUploadValueChangedEvent', this.value);
  }
  get attributes(): FileUploadAttributes {
    return this.attrs;
  }

  fileUploadItemTypes = FileUploadItemTypes;
  refData: string = null;
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

    this.eventBusService
      .on('fileUploadRelatedValueChangedEvent')
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((payload: FileResponseToBackendWithRelatedUploads) => {
        this.handleNewRelatedValueForItem(payload);
        this.cdr.markForCheck();
      });
  }

  getFiles(): FileResponseToBackendUploadsItem[] {
    return this.value?.files;
  }

  setUploadersRestrictions(): void {
    this.setUploadersMaxSizeAndAmount(Uploaders.total, this.attrs.maxSize, this.attrs.maxFileCount);

    this.attrs.uploads?.forEach(({ uploadId, maxFileCount, maxSize }: FileUploadItem) =>
      this.setUploadersMaxSizeAndAmount(uploadId, maxSize, maxFileCount),
    );
  }

  setUploadersMaxSizeAndAmount(uploader: string, maxSize: number, maxAmount: number): void {
    if (maxSize) {
      this.fileUploadService.setMaxFilesSize(maxSize, uploader);
    }
    if (maxAmount) {
      this.fileUploadService.setMaxFilesAmount(maxAmount, uploader);
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
    this.value.files.forEach((valueItem: FileResponseToBackendUploadsItem) => {
      if (valueItem.uploadId === $eventData.uploadId) {
        // eslint-disable-next-line no-param-reassign
        valueItem.value = $eventData.value;
        // eslint-disable-next-line no-param-reassign
        valueItem.required = $eventData.required;
      }
      return valueItem;
    });
    this.value.errors = $eventData.errors;

    if (!this.isRelatedUploads) {
      this.eventBusService.emit('fileUploadValueChangedEvent', this.value);
    } else {
      this.eventBusService.emit('fileUploadRelatedValueChangedEvent', {
        uploadId: this.uploadId,
        required: $eventData.required,
        uploads: this.value.files,
      } as FileResponseToBackendWithRelatedUploads);
    }
  }

  /**
   * Обрабатывает новое значение от формы загрузки по связанным документам
   * @param $eventData - новые значения от формы
   */
  handleNewRelatedValueForItem($eventData: FileResponseToBackendWithRelatedUploads): void {
    this.eventBusService.emit('fileUploadValueChangedEvent', {
      uploadId: $eventData.uploadId,
      relatedUploads: {
        uploads: $eventData.uploads,
      },
    } as FileResponseToBackendUploadsItem);
  }

  /**
   * Возвращает массив из строк связанных с компонентом ответов польвателя
   * @param attrs - аттрибуты блока
   * @param refBlock - блок ответов связанного компонента
   * @private
   */
  private getRefSubLabels(
    attrs: FileUploadAttributes,
    refBlock: Array<{ [key: string]: string }>,
  ): string {
    const subLabel = [];
    const isArrData = Array.isArray(refBlock);

    attrs.idAttrs.forEach((id) => {
      if (isArrData) {
        refBlock.filter((ref) => ref[id]).forEach((ref) => subLabel.push(ref[id]));
      } else if (refBlock[id]) {
        subLabel.push(refBlock[id]);
      }
    });
    return subLabel.length ? subLabel.join(' ') : null;
  }

  /**
   * Возвращает данные по ref параметру из applicantAnswers для формирования дополнительного заголовка
   * @param attrs - аттрибуты блока
   */
  private getRefValuesForApplicantAnswers(attrs: FileUploadAttributes): string {
    const sections = attrs.ref.split('.');
    const key = sections[0];
    const blockKey = sections[1];
    let value = this.applicantAnswers[key]?.value;

    if (value) {
      value = JSON.parse(value);
      const refBlock = value[blockKey];

      if (refBlock) {
        return this.getRefSubLabels(attrs, refBlock);
      }
    }
    return null;
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
