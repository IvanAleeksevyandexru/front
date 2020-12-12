import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { SubComponentsModule } from './sub-components/sub-components.module';

import { FileUploadScreenComponent } from './file-upload-screen.component';
import { CoreModule } from '../../../../core/core.module';
import { BaseModule } from '../../../../shared/components/base/base.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';

const COMPONENTS = [FileUploadScreenComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CoreModule, SharedModule, SubComponentsModule, BaseModule, ScreenContainerModule],
})
export class FileUploadModule {}
