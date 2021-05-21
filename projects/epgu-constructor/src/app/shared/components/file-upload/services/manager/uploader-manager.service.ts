import { Injectable } from '@angular/core';
import { FileUploadItem } from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { concatMap, distinctUntilChanged, shareReplay, tap } from 'rxjs/operators';

import { FileUploadService } from '../../file-upload.service';

import { LoggerService } from '../../../../../core/services/logger/logger.service';
import { Uploader } from '../../models/Uploader.model';
import { PrepareService } from '../../prepare.service';

@Injectable()
export class UploaderManagerService {
  getList$ = this.screen.orderId$.pipe(
    distinctUntilChanged(),
    tap(() => this.reset()),
    concatMap((orderId: number) => this.api.getListByObjectId(String(orderId))),
    shareReplay(1),
  );
  uploaderList: Record<string, Uploader> = {};

  constructor(
    private api: TerraByteApiService,
    private screen: ScreenService,
    private limits: FileUploadService,
    private logger: LoggerService,
    private prepare: PrepareService,
  ) {}
  // eslint-disable-next-line no-empty-function
  reset(): void {}
  getUploader(prefixForMnemonic: string, objectId: string, config: FileUploadItem): Uploader {
    const id = `${objectId}${prefixForMnemonic}${config.uploadId}`;
    if (!this.uploaderList[id]) {
      this.register(prefixForMnemonic, objectId, config);
    }
    return this.uploaderList[id];
  }

  register(prefixForMnemonic: string, objectId: string, config: FileUploadItem): void {
    this.limits.registerUploader(
      config.uploadId,
      config?.maxCountByTypes?.length > 0 || !config?.maxFileCount ? 0 : config.maxFileCount,
      config?.maxSize,
    );
    this.uploaderList[`${objectId}${prefixForMnemonic}${config.uploadId}`] = new Uploader(
      prefixForMnemonic,
      objectId,
      config,
      this.api,
      this.prepare,
      this.limits,
    );
  }

  acceptTypes(): string {
    return '';
  }
}
