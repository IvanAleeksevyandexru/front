import { NgModule } from '@angular/core';
import { FileUploadModule } from '../../../../shared/components/file-upload/file-upload.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';
import { IdentificationUploadScreenComponent } from './identification-upload-screen.component';
import { IdentificationApiService } from '../../shared/identification-api/identification-api.service';

@NgModule({
  declarations: [IdentificationUploadScreenComponent],
  exports: [IdentificationUploadScreenComponent],
  imports: [
    BaseModule,
    FileUploadModule,
    BaseComponentsModule,
    ScreenContainerModule,
    UserInfoLoaderModule,
    ScreenButtonsModule,
  ],
  providers: [IdentificationApiService],
  entryComponents: [IdentificationUploadScreenComponent],
})
export class IdentificationUploadScreenModule {}
