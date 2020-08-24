import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { UniqueScreenComponent } from './components/unique-screen/unique-screen.component';
import { AddChildrenScreenModule } from './components/add-children/screens/add-children-screen/add-children-screen.module';
import { SharedModule } from '../../shared-module/shared-components.module';
import { SelectMapObjectModule } from './components/select-map-object/select-map-object.module';

const COMPONENTS = [
  UniqueScreenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    AddChildrenScreenModule,
    SharedModule,
    EpguLibModule.forChild(),
    SelectMapObjectModule,
  ]
})
export class UniqueScreenModule { }
