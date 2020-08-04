import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { SharedComponentsModule } from '../../module-share/shared-components.module';
import { EpguLibModule } from 'epgu-lib';
import {LabelSectionComponent} from './components/lablel-section/label-section.component';

const COMPONENTS = [
  CustomScreenComponent
]

@NgModule({
  declarations: [...COMPONENTS, LabelSectionComponent],
  exports: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    SharedComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class CustomScreenModule { }
