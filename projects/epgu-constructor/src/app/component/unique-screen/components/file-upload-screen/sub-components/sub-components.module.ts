import { NgModule } from '@angular/core';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadService } from './file-upload.service';
import { BaseModule } from '../../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../../shared/components/user-info-loader/user-info-loader.module';
import { UploaderModule } from '../../../../../shared/components/uploader/uploader.module';
import { FileSizeModule } from '../../../../../shared/pipes/file-size/file-size.module';
import { PrepareService } from './prepare.service';
import { EpguLibModule } from 'epgu-lib';

const COMPONENTS = [FileUploadComponent, FileUploadItemComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [BaseModule, UserInfoLoaderModule, UploaderModule, FileSizeModule, EpguLibModule],
  providers: [FileUploadService, PrepareService],
  entryComponents: [...COMPONENTS],
})
export class SubComponentsModule {}
