import { NgModule } from '@angular/core';
import { FileUploadItemComponent } from './file-upload-item/file-upload-item.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CoreModule } from '../../../../../core/core.module';
import { FileUploadService } from './file-upload.service';

const COMPONENTS = [FileUploadComponent, FileUploadItemComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [CoreModule],
  providers: [FileUploadService],
  entryComponents: [...COMPONENTS],
})
export class SubComponentsModule {}
