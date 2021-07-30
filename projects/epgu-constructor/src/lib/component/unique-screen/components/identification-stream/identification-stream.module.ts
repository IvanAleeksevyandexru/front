import { NgModule } from '@angular/core';
import { FileUploadModule } from '../../../../shared/components/file-upload/file-upload.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule, ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { ScreenButtonsModule } from '../../../../shared/components/screen-buttons/screen-buttons.module';

import { IdentificationApiService } from '../../shared/identification-api/identification-api.service';
import { IdentificationStreamComponent } from './identification-stream.component';
import { IdentificationStreamService } from '../../shared/identification-stream/identification-stream.service';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';

@NgModule({
  declarations: [IdentificationStreamComponent],
  exports: [IdentificationStreamComponent],
  imports: [
    BaseModule,
    FileUploadModule,
    BaseComponentsModule,
    ScreenContainerModule,
    UserInfoLoaderModule,
    ScreenButtonsModule,
    ScreenPadModule,
  ],
  providers: [IdentificationApiService, IdentificationStreamService, TerraByteApiService],
  entryComponents: [IdentificationStreamComponent],
})
export class IdentificationStreamModule {}
