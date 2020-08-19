import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { EpguLibModule } from 'epgu-lib';
import {LabelSectionComponent} from './components/lablel-section/label-section.component';
import { ForeignCitizenshipComponent } from './components/foreign-citizenship/foreign-citizenship.component';
import {EpgucSharedModule} from '../../shared-module/shared-components.module';
import {FileUploadComponent} from './components/file-upload/file-upload.component';
import {FileUploadItemComponent} from './components/file-upload-item/file-upload-item.component';
import { WebcamModule } from 'ngx-webcam';
import { WebcamShotComponent } from './components/webcam-shot/webcam-shot.component';

const COMPONENTS = [
  CustomScreenComponent
]

@NgModule({
  declarations: [...COMPONENTS,
    LabelSectionComponent,
    ForeignCitizenshipComponent,
    FileUploadComponent,
    FileUploadItemComponent,
    WebcamShotComponent
  ],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    EpgucSharedModule,
    WebcamModule,
    EpguLibModule.forChild(),
  ]
})
export class CustomScreenModule { }
