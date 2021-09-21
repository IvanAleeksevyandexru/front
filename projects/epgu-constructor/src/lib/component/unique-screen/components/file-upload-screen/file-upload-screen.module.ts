import { NgModule } from '@angular/core';
import { FileUploadModule } from '../../../../shared/components/file-upload/file-upload.module';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { PluralizeModule } from '@epgu/ui/pipes';
import { FileSizeModule } from '../../../../shared/pipes/file-size/file-size.module';

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
})
export class FileUploadScreenModule {}
