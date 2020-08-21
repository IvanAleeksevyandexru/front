import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { EpguLibModule } from 'epgu-lib';
import {LabelSectionComponent} from './components/lablel-section/label-section.component';
import {EpgucSharedModule} from '../../shared-module/shared-components.module';

const COMPONENTS = [
  CustomScreenComponent
]

@NgModule({
  declarations: [...COMPONENTS,
    LabelSectionComponent
  ],
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
