import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared-module/shared-components.module';
import { NavigationProgressComponent } from './component/navigation-progress/navigation-progress.component';


const COMPONENT = [
  NavigationProgressComponent
];

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class LayoutModule { }
