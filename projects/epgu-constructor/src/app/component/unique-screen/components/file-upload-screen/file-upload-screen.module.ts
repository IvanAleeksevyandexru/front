import { NgModule } from '@angular/core';
import { FileUploadModule } from '../../../../shared/components/file-upload/file-upload.module';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';

@NgModule({
  declarations: [FileUploadScreenComponent],
  exports: [FileUploadScreenComponent],
  imports: [
    BaseModule,
    FileUploadModule,
    BaseComponentsModule,
    ScreenContainerModule,
    UserInfoLoaderModule,
  ],
  entryComponents: [FileUploadScreenComponent]
})
export class FileUploadScreenModule {}
