import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { CustomScreenComponent } from './custom-screen.component';
import { ScreenService } from '../screen.service';
import { AddressHelperService } from '../../components-list/address-helper.service';
import { ComponentListToolsService } from '../../components-list/services/component-list-tools.service';
import { ComponentsListModule } from '../../components-list/components-list.module';

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
    ComponentsListModule,
  ],
  providers: [
    ScreenService,
    AddressHelperService,
    ComponentListToolsService,
  ]
})
export class CustomScreenModule { }
