import { NgModule } from '@angular/core';
import { SubComponentsModule } from './sub-components/sub-components.module';
import { FileUploadScreenComponent } from './file-upload-screen.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { TerraByteApiService } from '../../../../core/services/terra-byte-api/terra-byte-api.service';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';

@NgModule({
  declarations: [FileUploadScreenComponent],
  exports: [FileUploadScreenComponent],
  imports: [
    BaseModule,
    SubComponentsModule,
    BaseComponentsModule,
    ScreenContainerModule,
    UserInfoLoaderModule,
  ],
  providers: [TerraByteApiService],
  entryComponents: [FileUploadScreenComponent]
})
export class FileUploadModule {}
