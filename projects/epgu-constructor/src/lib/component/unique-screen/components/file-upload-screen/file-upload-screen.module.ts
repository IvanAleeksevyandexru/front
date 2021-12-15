import { NgModule } from '@angular/core';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { PluralizeModule } from '@epgu/ui/pipes';
import { FileUploadModule } from '../../../../shared/components/file-upload/file-upload.module';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { FileSizeModule } from '../../../../shared/pipes/file-size/file-size.module';
import { UploaderScreenService } from '../../../../shared/components/file-upload/services/screen/uploader-screen.service';
import { UniqueScreenService } from '../../unique-screen.service';

@NgModule({
  declarations: [FileUploadScreenComponent],
  exports: [FileUploadScreenComponent],
  imports: [
    BaseModule,
    FileUploadModule,
    BaseComponentsModule,
    ScreenContainerModule,
    UserInfoLoaderModule,
    ScreenButtonsModule,
    PluralizeModule,
    FileSizeModule,
  ],
  entryComponents: [FileUploadScreenComponent],
  providers: [UploaderScreenService, UniqueScreenService],
})
export class FileUploadScreenModule {}
