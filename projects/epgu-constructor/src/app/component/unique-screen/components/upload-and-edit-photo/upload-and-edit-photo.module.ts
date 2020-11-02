import { NgModule } from '@angular/core';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import { LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME,
} from '@alyle/ui';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';
import { SliderComponent } from './slider/slider.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { UploadAndEditPhotoComponent } from './upload-and-edit-photo.component';
import { PhotoEditorModalComponent } from './photo-editor-modal/photo-editor-modal.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PhotoErrorModalComponent } from './photo-error-modal/photo-error-modal.component';
import { CompressionService } from './compression/compression.service';
import { PhotoRequirementsModalComponent } from './photo-requirements-modal/photo-requirements-modal.component';
import { CoreModule } from '../../../../core/core.module';
import { ModalModule } from '../../../../modal/modal.module';


@NgModule({
  entryComponents: [
    PhotoErrorModalComponent,
    PhotoEditorModalComponent,
    PhotoRequirementsModalComponent,
  ],
  declarations: [
    PhotoErrorModalComponent,
    PhotoEditorModalComponent,
    UploadAndEditPhotoComponent,
    SliderComponent,
    PhotoRequirementsModalComponent,
  ],
  imports: [
    CoreModule,
    ModalModule,
    SharedModule,
    LyImageCropperModule,
    AngularResizedEventModule,
  ],
  exports: [
    UploadAndEditPhotoComponent,
  ],
  providers: [
    CompressionService,
    [ LyTheme2 ],
    [ StyleRenderer ],
    // Theme that will be applied to this module
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true }, // name: `minima-light`
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
  ]
})
export class UploadAndEditPhotoModule { }