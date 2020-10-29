import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../shared/shared.module';
import { ValidationService } from './services/validation.service';
import { AddressHelperService } from './components-list/address-helper.service';
import { ComponentListToolsService } from './components-list/services/component-list-tools.service';
import { ComponentsListComponent } from './components-list/components-list.component';

const COMPONENTS = [
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
    EpguLibModule,
  ],
  providers: [
    ValidationService,
    AddressHelperService,
    ComponentListToolsService,
  ]
})
export class CustomScreenComponentsModule { }
