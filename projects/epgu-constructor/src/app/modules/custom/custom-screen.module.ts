import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { EpguLibModule } from 'epgu-lib';
import { LabelSectionComponent } from './components/lablel-section/label-section.component';
import { SharedModule } from '../../shared-module/shared-components.module';
import { RadioInputComponent } from './components/radio-input/radio-input.component';

const COMPONENTS = [CustomScreenComponent]

@NgModule({
  declarations: [
    ...COMPONENTS,
    LabelSectionComponent,
    RadioInputComponent,
  ],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule.forChild(),
  ]
})
export class CustomScreenModule { }
