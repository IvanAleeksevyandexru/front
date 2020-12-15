import { NgModule } from '@angular/core';
import { SubComponentsModule } from './sub-components/sub-components.module';

import { FileUploadScreenComponent } from './file-upload-screen.component';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { TerraByteApiService } from '../../services/terra-byte-api/terra-byte-api.service';

const COMPONENTS = [FileUploadScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CoreModule, SubComponentsModule, BaseModule, ScreenContainerModule],
  providers: [TerraByteApiService]
})
export class FileUploadModule {}
