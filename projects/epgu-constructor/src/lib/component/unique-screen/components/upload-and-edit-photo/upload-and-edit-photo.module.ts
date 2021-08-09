import { NgModule } from '@angular/core';

import { UploadAndEditPhotoContainerComponent } from './container/upload-and-edit-photo-container.component';
import { PhotoRequirementsModalComponent } from './component/photo-requirements-modal/photo-requirements-modal.component';
import { ModalModule } from '../../../../modal/modal.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../../shared/base.module';
import { PhotoDescriptionComponent } from './component/photo-description/photo-description.component';
import { UploadAndEditPhotoFormModule } from '../../../../shared/components/upload-and-edit-photo-form/upload-and-edit-photo-form.module';
import { ClickableLabelModule } from '../../../../shared/directives/clickable-label/clickable-label.module';

@NgModule({
  entryComponents: [PhotoRequirementsModalComponent, UploadAndEditPhotoContainerComponent],
  declarations: [
    UploadAndEditPhotoContainerComponent,
    PhotoRequirementsModalComponent,
    PhotoDescriptionComponent,
  ],
  imports: [
    BaseModule,
    ModalModule,
    BaseComponentsModule,
    ScreenContainerModule,
    UploadAndEditPhotoFormModule,
    ClickableLabelModule,
  ],
  exports: [UploadAndEditPhotoContainerComponent],
  providers: [],
})
export class UploadAndEditPhotoModule {}
