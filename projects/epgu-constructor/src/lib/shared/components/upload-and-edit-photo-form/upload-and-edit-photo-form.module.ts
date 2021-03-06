import { NgModule } from '@angular/core';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyTheme2, StyleRenderer, LY_THEME, LY_THEME_NAME } from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { AngularResizedEventModule } from 'angular-resize-event';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '@epgu/epgu-constructor-ui-kit';
import { PhotoErrorModalComponent } from './components/photo-error-modal/photo-error-modal.component';
import { PhotoEditorModalComponent } from './components/photo-editor-modal/photo-editor-modal.component';
import { SliderComponent } from './components/slider/slider.component';
import { PhotoFormComponent } from './components/photo-form/photo-form.component';
import { PhotoFormViewComponent } from './components/photo-form-view/photo-form-view.component';
import { ModalModule } from '../../../modal/modal.module';
import { WebcamShootModule } from '../webcam-shoot/webcam-shoot.module';
import { DragAndDropModule } from '../../directives/drag-and-drop/drag-and-drop.module';
import { CompressionService } from './service/compression/compression.service';
import { ValidationService } from './service/validation/validation.service';
import { UploadService } from './service/upload/upload.service';
import { BaseModule } from '../../base.module';

@NgModule({
  declarations: [
    PhotoErrorModalComponent,
    PhotoEditorModalComponent,
    SliderComponent,
    PhotoFormComponent,
    PhotoFormViewComponent,
  ],
  imports: [
    ModalModule,
    WebcamShootModule,
    LyImageCropperModule,
    AngularResizedEventModule,
    DragAndDropModule,
    BaseModule,
    FormsModule,
    IconsModule,
  ],
  exports: [PhotoFormComponent],
  providers: [
    CompressionService,
    ValidationService,
    UploadService,
    [LyTheme2],
    [StyleRenderer],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
  ],
})
export class UploadAndEditPhotoFormModule {}
