import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';
import { SharedComponentsModule } from '../../module-share/shared-components.module';
import { AddChildrenScreenModule } from './components/add-children/screens/add-children-screen/add-children-screen.module';
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
    AddChildrenScreenModule,
    EpguLibModule.forChild(),
  ]
})
export class CustomScreenModule { }
