import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './component/navigation/navigation.component';
import { NavigationService } from './service/navigation/navigation.service';
import { SharedModule } from '../shared-module/shared-components.module';


const COMPONENT = [
  NavigationComponent
]

@NgModule({
  declarations: [...COMPONENT],
  exports: [...COMPONENT],
  providers: [NavigationService],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class LayoutModule { }
