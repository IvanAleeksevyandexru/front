import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { EpguLibModule } from 'epgu-lib';
import { LabelSectionComponent } from './components/lablel-section/label-section.component';
import { ForeignCitizenshipComponent } from './components/foreign-citizenship/foreign-citizenship.component';
import { SharedModule } from '../../shared-module/shared-components.module';

const COMPONENTS = [
  CustomScreenComponent,
  LabelSectionComponent,
  ForeignCitizenshipComponent,
]

@NgModule({
  declarations: [...COMPONENTS],
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
