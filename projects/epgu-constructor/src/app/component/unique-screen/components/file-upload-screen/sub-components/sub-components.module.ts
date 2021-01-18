import { NgModule } from '@angular/core';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FileUploadService } from './file-upload.service';
import { BaseModule } from '../../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../../shared/components/user-info-loader/user-info-loader.module';

const COMPONENTS = [FileUploadComponent, FileUploadItemComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [BaseModule, UserInfoLoaderModule],
  providers: [FileUploadService],
  entryComponents: [...COMPONENTS],
})
export class SubComponentsModule {}
