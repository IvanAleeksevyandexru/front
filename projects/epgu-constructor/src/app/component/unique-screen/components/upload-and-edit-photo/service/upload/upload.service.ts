import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import { TerraUploadedFile } from '../../../file-upload-screen/sub-components/file-upload-item/data';
import { TerraByteApiService } from '../../../../services/terra-byte-api/terra-byte-api.service';
import { TerabyteListItem } from '../../../../services/terra-byte-api/terra-byte-api.types';
import { CompressionService } from '../compression/compression.service';
import { ComponentUploadedFileDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { UtilsService } from '../../../../../../core/services/utils/utils.service';

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
    // TODO: вынести в серивс
    // let requestData = this.getRequestData();
    let dataAfterSend: ComponentUploadedFileDto;

    // const deletePrevImage = (fileName: string): Observable<TerraUploadedFile> =>
    //   fileName
    //     ? this.terabyteService.deleteFile(requestData).pipe(catchError(() => of(null)))
    //     : of(null);
    // const compressFile = (): Observable<Blob | File> => {
    //   const blobFile = TerraByteApiService.base64toBlob(croppedImageUrl);
    //   return fromPromise(this.compressionService.imageCompression(blobFile, { maxSizeMB: 5 }));
    // };
    // const uploadFile = (file: Blob | File): Observable<void> => {
    //   const fileName2 = fileName.split('.');
    //   fileName2[fileName2.length - 1] = 'jpg';
    //   const name = this.utils.cyrillicToLatin(fileName2.join('.'));
    //   requestData = { ...requestData, name };
    //   return this.terabyteService.uploadFile(requestData, file);
    // };

    return of(requestData.name).pipe(
      switchMap((fileName) => this.deletePrevImage(fileName, requestData)),
      switchMap(() => this.compressFile(croppedImageUrl)),
      map((compressedFile) => this.prepareFile(fileName, requestData, compressedFile)),
      tap(({ requestData }) => {
        dataAfterSend = requestData;
      }),
      switchMap(({ requestData, compressedFile }) => this.uploadFile(compressedFile, requestData)),
      switchMap(() => this.terabyteService.getFileInfo(requestData)),
      map((terraFile) => {
        return { ...dataAfterSend, ...terraFile };
      }),
    );
  }

  deletePrevImage(
    fileName: string,
    requestData: ComponentUploadedFileDto,
  ): Observable<TerraUploadedFile> {
    return fileName
      ? this.terabyteService.deleteFile(requestData).pipe(catchError(() => of(null)))
      : of(null);
  }

  compressFile(croppedImageUrl: string): Observable<Blob | File> {
    const blobFile = TerraByteApiService.base64toBlob(croppedImageUrl);
    return fromPromise(this.compressionService.imageCompression(blobFile, { maxSizeMB: 5 }));
  }

  prepareFile(
    fileName: string,
    requestData: ComponentUploadedFileDto,
    compressedFile: Blob | File,
  ): { requestData: ComponentUploadedFileDto; compressedFile: Blob | File } {
    const prepareFileName = fileName.split('.');
    prepareFileName[prepareFileName.length - 1] = 'jpg';
    const name = this.utils.cyrillicToLatin(prepareFileName.join('.'));
    return { requestData: { ...requestData, name }, compressedFile };
  }

  uploadFile(file: Blob | File, requestData: ComponentUploadedFileDto): Observable<void> {
    return this.terabyteService.uploadFile(requestData, file);
  }
}
