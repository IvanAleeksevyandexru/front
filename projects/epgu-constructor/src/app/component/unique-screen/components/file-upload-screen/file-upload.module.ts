import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { SubComponentsModule } from './sub-components/sub-components.module';

import { FileUploadScreenComponent } from './file-upload-screen.component';
import { CoreModule } from '../../../../core/core.module';


const COMPONENTS = [
  FileUploadScreenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    SubComponentsModule,
  ],
})
export class FileUploadModule {}
