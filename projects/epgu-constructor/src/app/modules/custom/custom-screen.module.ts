import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared-module/shared-components.module';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { RadioInputComponent } from './components/radio-input/radio-input.component';

const COMPONENTS = [CustomScreenComponent, RadioInputComponent];

@NgModule({
  declarations: [
    ...COMPONENTS,
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
