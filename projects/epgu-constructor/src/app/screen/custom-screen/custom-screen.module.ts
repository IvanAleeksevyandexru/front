import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { CustomScreenComponent } from './custom-screen.component';
import { ScreenService } from '../screen.service';

const COMPONENTS = [
  CustomScreenComponent,
];

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
    EpguLibModule,
  ],
  providers: [
    ScreenService
  ]
})
export class CustomScreenModule { }
