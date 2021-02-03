import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { TerraByteApiService } from '../../../../../component/unique-screen/services/terra-byte-api/terra-byte-api.service';
import { TerabyteListItem } from '../../../../../component/unique-screen/services/terra-byte-api/terra-byte-api.types';
import { CompressionService } from '../compression/compression.service';
import { ComponentUploadedFileDto } from '../../../../../form-player/services/form-player-api/form-player-api.types';
import { UtilsService } from '../../../../../core/services/utils/utils.service';
// eslint-disable-next-line max-len
import { TerraUploadedFile } from '../../../../../component/unique-screen/components/file-upload-screen/sub-components/file-upload-item/data';

@Injectable()
export class UploadService {
  constructor(
    private terabyteService: TerraByteApiService,
    private compressionService: CompressionService,
    private utils: UtilsService,
  ) {}

  uploadPhotoToServer(
    fileName: string,
    requestData: ComponentUploadedFileDto,
    croppedImageUrl: string,
  ): Observable<TerabyteListItem & ComponentUploadedFileDto> {
    let dataAfterSend: ComponentUploadedFileDto;

    return of(requestData.name).pipe(
      switchMap((fileName) => this.deletePrevImage(fileName, requestData)),
      switchMap(() => this.compressFile(croppedImageUrl)),
      map((compressedFile) => this.prepareFile(fileName, requestData, compressedFile)),
      tap(({ requestData }) => (dataAfterSend = requestData)),
      switchMap(({ requestData, compressedFile }) => this.uploadFile(compressedFile, requestData)),
      switchMap(() => this.terabyteService.getFileInfo(requestData)),
      map((terraFile) => ({ ...dataAfterSend, ...terraFile })),
    );
  }

  private deletePrevImage(
    fileName: string,
    requestData: ComponentUploadedFileDto,
  ): Observable<TerraUploadedFile> {
    return fileName
      ? this.terabyteService.deleteFile(requestData).pipe(catchError(() => of(null)))
      : of(null);
  }

  private compressFile(croppedImageUrl: string): Observable<Blob | File> {
    const blobFile = TerraByteApiService.base64toBlob(croppedImageUrl);

    return fromPromise(this.compressionService.imageCompression(blobFile, { maxSizeMB: 5 }));
  }

  private prepareFile(
    fileName: string,
    requestData: ComponentUploadedFileDto,
    compressedFile: Blob | File,
  ): { requestData: ComponentUploadedFileDto; compressedFile: Blob | File } {
    const prepareFileName = fileName.split('.');
    prepareFileName[prepareFileName.length - 1] = 'jpg';
    const name = this.utils.cyrillicToLatin(prepareFileName.join('.'));

    return { requestData: { ...requestData, name }, compressedFile };
  }

  private uploadFile(file: Blob | File, requestData: ComponentUploadedFileDto): Observable<void> {
    return this.terabyteService.uploadFile(requestData, file);
  }
}
