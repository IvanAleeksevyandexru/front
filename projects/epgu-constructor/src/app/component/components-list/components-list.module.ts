import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ValidationService } from './services/validation.service';
import { AddressHelperService } from './address-helper.service';
import { ComponentListToolsService } from './services/component-list-tools.service';
import { ComponentsListComponent } from './components-list.component';
import { ToolsService } from '../shared/services/tools/tools.service';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { CoreModule } from '../../core/core.module';

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
    CoreModule,
    SharedModule,
  ],
  providers: [
    ValidationService,
    AddressHelperService,
    ComponentListToolsService,
    ToolsService,
    DictionaryApiService
  ]
})
export class ComponentsListModule { }
