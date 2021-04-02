import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadService } from './file-upload.service';
import { BaseModule } from '../../base.module';
import { UserInfoLoaderModule } from '../user-info-loader/user-info-loader.module';
import { UploaderModule } from '../uploader/uploader.module';
import { FileSizeModule } from '../../pipes/file-size/file-size.module';
import { PrepareService } from './prepare.service';

const COMPONENTS = [FileUploadComponent, FileUploadItemComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [BaseModule, UserInfoLoaderModule, UploaderModule, FileSizeModule, EpguLibModule],
  providers: [FileUploadService, PrepareService],
  entryComponents: [...COMPONENTS],
})
export class FileUploadModule {}
