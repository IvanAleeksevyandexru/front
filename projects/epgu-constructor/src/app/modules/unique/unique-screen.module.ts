import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import { UniqueScreenComponent } from './components/unique-screen/unique-screen.component';
import { AddChildrenScreenModule } from './components/add-children/screens/add-children-screen/add-children-screen.module';
import {EpgucSharedModule} from '../../shared-module/shared-components.module';
import {AddPassportScreenModule} from './components/add-passport/add-passport-screen.module';

const COMPONENTS = [
  UniqueScreenComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    AddChildrenScreenModule,
    AddPassportScreenModule,

    EpgucSharedModule,
    EpguLibModule.forChild(),
  ]
})
export class UniqueScreenModule { }
