import { NgModule } from '@angular/core';
import { SubComponentsModule } from './sub-components/sub-components.module';

import { FileUploadScreenComponent } from './file-upload-screen.component';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { TerraByteApiService } from '../../services/terra-byte-api/terra-byte-api.service';
import { BaseModule } from '../../../../shared/base.module';

const COMPONENTS = [FileUploadScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [BaseModule, SubComponentsModule, BaseComponentsModule, ScreenContainerModule],
  providers: [TerraByteApiService]
})
export class FileUploadModule {}
