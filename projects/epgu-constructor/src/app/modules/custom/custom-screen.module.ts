import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { EpgucSharedModule } from '../../shared-module/shared-components.module';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { LabelSectionComponent } from './components/lablel-section/label-section.component';
import { RadioInputComponent } from './components/radio-input/radio-input.component';

const COMPONENTS = [
  CustomScreenComponent,
  RadioInputComponent,
  LabelSectionComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
  ]
})
export class CustomScreenModule { }
