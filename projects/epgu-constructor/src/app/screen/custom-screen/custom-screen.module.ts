import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { CustomScreenComponent } from './custom-screen.component';
import { ScreenService } from '../screen.service';
import { ComponentsListComponent } from './components-list/components-list.component';

const COMPONENTS = [
  CustomScreenComponent,
  ComponentsListComponent,
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
    EpguLibModule.forChild(),
  ],
  providers: [
    ScreenService
  ]
})
export class CustomScreenModule { }
