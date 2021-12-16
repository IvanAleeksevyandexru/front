import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import { WordTransformService } from '@epgu/epgu-constructor-ui-kit';
import { ComponentUploadedFileDto } from '@epgu/epgu-constructor-types';
import { TerraByteApiService } from '../../../../../core/services/terra-byte-api/terra-byte-api.service';
import { UploadedFile } from '../../../../../core/services/terra-byte-api/terra-byte-api.types';
import { CompressionService } from '../compression/compression.service';

@Injectable()
export class UploadService {
  constructor(
    private terraByteApiService: TerraByteApiService,
    private compressionService: CompressionService,
    private wordTransformService: WordTransformService,
  ) {}

  uploadPhotoToServer(
    fileName: string,
    requestData: ComponentUploadedFileDto,
    croppedImageUrl: string,
  ): Observable<UploadedFile & ComponentUploadedFileDto> {
    let dataAfterSend: ComponentUploadedFileDto;

    return of(requestData.name).pipe(
      switchMap((name) => this.deletePrevImage(name, requestData)),
      switchMap(() => this.compressFile(croppedImageUrl)),
      map((compressedFile) => this.prepareFile(fileName, requestData, compressedFile)),
      tap((data) => (dataAfterSend = data?.requestData)),
      switchMap((data) =>
        this.terraByteApiService.uploadFile(data?.requestData, data?.compressedFile),
      ),
      switchMap(() => this.terraByteApiService.getFileInfo(requestData)),
      map((terraFile) => ({ ...dataAfterSend, ...terraFile })),
    );
  }

  private deletePrevImage(
    fileName: string,
    requestData: ComponentUploadedFileDto,
  ): Observable<UploadedFile> {
    return fileName
      ? this.terraByteApiService.deleteFile(requestData).pipe(catchError(() => of(null)))
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
    const name = this.wordTransformService.cyrillicToLatin(prepareFileName.join('.'));

    return { requestData: { ...requestData, name }, compressedFile };
  }
}
