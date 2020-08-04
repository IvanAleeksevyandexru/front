import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { SharedComponentsModule } from '../../module-share/shared-components.module';
import { EpguLibModule } from 'epgu-lib';

const COMPONENTS = [
  CustomScreenComponent
]

@NgModule({
  declarations: [...COMPONENTS],
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
