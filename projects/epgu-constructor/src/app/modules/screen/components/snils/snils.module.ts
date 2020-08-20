import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { SnilsComponent } from './snils.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared-components.module';

const COMPONENTS = [
  SnilsComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    EpguLibModule.forChild(),
  ]
})
export class SnilsModule { }

