import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CoreModule } from '../../../../../core/core.module';

const COMPONENTS = [
  FileUploadComponent,
  FileUploadItemComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
  ],
  entryComponents: [...COMPONENTS]
})
export class SubComponentsModule {}
