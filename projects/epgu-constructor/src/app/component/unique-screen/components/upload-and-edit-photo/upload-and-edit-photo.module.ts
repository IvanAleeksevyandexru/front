import { NgModule } from '@angular/core';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyTheme2, StyleRenderer, LY_THEME, LY_THEME_NAME } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { SliderComponent } from './slider/slider.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { UploadAndEditPhotoComponent } from './upload-and-edit-photo.component';
import { PhotoEditorModalComponent } from './photo-editor-modal/photo-editor-modal.component';
import { PhotoErrorModalComponent } from './photo-error-modal/photo-error-modal.component';
import { CompressionService } from './compression/compression.service';
import { PhotoRequirementsModalComponent } from './photo-requirements-modal/photo-requirements-modal.component';
import { ModalModule } from '../../../../modal/modal.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { ScreenContainerModule } from '../../../../shared/components/screen-container/screen-container.module';
import { DragAndDropModule } from '../../../../shared/directives/drag-and-drop/drag-and-drop.module';
import { WebcamShootModule } from '../../../../shared/components/webcam-shoot/webcam-shoot.module';
import { TerraByteApiService } from '../../services/terra-byte-api/terra-byte-api.service';
import { BaseModule } from '../../../../shared/base.module';
import { UserInfoLoaderModule } from '../../../../shared/components/user-info-loader/user-info-loader.module';

@NgModule({
  entryComponents: [
    PhotoErrorModalComponent,
    PhotoEditorModalComponent,
    PhotoRequirementsModalComponent,
    UploadAndEditPhotoComponent,
  ],
  declarations: [
    PhotoErrorModalComponent,
    PhotoEditorModalComponent,
    UploadAndEditPhotoComponent,
    SliderComponent,
    PhotoRequirementsModalComponent,
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
  exports: [UploadAndEditPhotoComponent],
  providers: [
    CompressionService,
    TerraByteApiService,
    [LyTheme2],
    [StyleRenderer],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
  ],
})
export class UploadAndEditPhotoModule {}
