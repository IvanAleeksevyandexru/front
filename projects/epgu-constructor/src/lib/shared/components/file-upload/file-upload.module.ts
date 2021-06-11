import { NgModule } from '@angular/core';

import { EpguLibModule } from '@epgu/epgu-lib';
import { MemoModule } from '@epgu/epgu-constructor-ui-kit';

import { FileUploadComponent } from './file-upload/file-upload.component';

import { BaseModule } from '../../base.module';
import { UserInfoLoaderModule } from '../user-info-loader/user-info-loader.module';
import { UploaderModule } from '../uploader/uploader.module';
import { FileSizeModule } from '../../pipes/file-size/file-size.module';
import { FileUploadContainerModule } from './file-upload-container/file-upload-container.module';

const COMPONENTS = [FileUploadComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    BaseModule,
    UserInfoLoaderModule,
    UploaderModule,
    FileSizeModule,
    EpguLibModule,
    FileUploadContainerModule,
    MemoModule,
  ],
  providers: [],
  entryComponents: [...COMPONENTS],
})
export class FileUploadModule {}