import { NgModule } from '@angular/core';
import { PluralizeModule } from '@epgu/ui/pipes';
import { IconsModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../base.module';
import { UserInfoLoaderModule } from '../../user-info-loader/user-info-loader.module';
import { UploaderModule } from '../../uploader/uploader.module';
import { FileSizeModule } from '../../../pipes/file-size/file-size.module';
import { FileUploadItemComponent } from '../file-upload-item/file-upload-item.component';
import { FileUploadContainerComponent } from './file-upload-container.component';
import { UploaderStoreService } from '../services/store/uploader-store.service';
import { UploaderValidationService } from '../services/validation/uploader-validation.service';
import { UploaderManagerService } from '../services/manager/uploader-manager.service';
import { UploaderProcessService } from '../services/process/uploader-process.service';
import { UploaderStatService } from '../services/stat/uploader-stat.service';

const COMPONENTS = [FileUploadItemComponent, FileUploadContainerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    BaseModule,
    UserInfoLoaderModule,
    UploaderModule,
    FileSizeModule,
    PluralizeModule,
    IconsModule,
  ],
  providers: [
    UploaderStoreService,
    UploaderValidationService,
    UploaderManagerService,
    UploaderProcessService,
    UploaderStatService,
  ],
})
export class FileUploadContainerModule {}
