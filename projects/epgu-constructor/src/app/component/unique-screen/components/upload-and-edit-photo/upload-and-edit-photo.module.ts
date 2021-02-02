import { NgModule } from '@angular/core';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyTheme2, StyleRenderer, LY_THEME, LY_THEME_NAME } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { SliderComponent } from './component/slider/slider.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { UploadAndEditPhotoContainerComponent } from './container/upload-and-edit-photo-container.component';
import { PhotoEditorModalComponent } from './component/photo-editor-modal/photo-editor-modal.component';
import { PhotoErrorModalComponent } from './component/photo-error-modal/photo-error-modal.component';
import { CompressionService } from './service/compression/compression.service';
import { PhotoRequirementsModalComponent } from './component/photo-requirements-modal/photo-requirements-modal.component';
import { ModalModule } from '../../../../modal/modal.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { DragAndDropModule } from '../../../../shared/directives/drag-and-drop/drag-and-drop.module';
import { WebcamShootModule } from '../../../../shared/components/webcam-shoot/webcam-shoot.module';
import { TerraByteApiService } from '../../services/terra-byte-api/terra-byte-api.service';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';
import { PhotoDescriptionComponent } from './component/photo-description/photo-description.component';
import { PhotoFormComponent } from './component/photo-form/photo-form.component';
import { ValidationService } from './service/validation/validation.service';
import { UploadService } from './service/upload/upload.service';
import { PhotoFormViewComponent } from './component/photo-form-view/photo-form-view.component';

@NgModule({
  entryComponents: [
    PhotoErrorModalComponent,
    PhotoEditorModalComponent,
    PhotoRequirementsModalComponent,
    UploadAndEditPhotoContainerComponent,
  ],
  declarations: [
    PhotoErrorModalComponent,
    PhotoEditorModalComponent,
    UploadAndEditPhotoContainerComponent,
    SliderComponent,
    PhotoRequirementsModalComponent,
    PhotoDescriptionComponent,
    PhotoFormComponent,
    PhotoFormViewComponent,
  ],
  imports: [
    BaseModule,
    ModalModule,
    WebcamShootModule,
    LyImageCropperModule,
    AngularResizedEventModule,
    BaseComponentsModule,
    ScreenContainerModule,
    DragAndDropModule,
    UserInfoLoaderModule,
  ],
  exports: [UploadAndEditPhotoContainerComponent],
  providers: [
    CompressionService,
    TerraByteApiService,
    ValidationService,
    UploadService,
    [LyTheme2],
    [StyleRenderer],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
  ],
})
export class UploadAndEditPhotoModule {}
