import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsListComponent } from './components-list.component';
import { ComponentListFormService } from './services/component-list-form.service';
import { ComponentListToolsService } from './services/component-list-tools.service';
import { ComponentListRepositoryService } from './services/component-list-repository.service';
import { ComponentItemComponent } from './component-item/component-item.component';
import { SharedModule } from '../shared/shared.module';
import { AddressHelperService } from './address-helper.service';
import { EpguLibModule } from 'epgu-lib';
import { DictionaryApiService } from '../services/api/dictionary-api/dictionary-api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    ComponentsListComponent,
    ComponentItemComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    EpguLibModule,
    BrowserAnimationsModule,
  ],
  exports: [
    ComponentsListComponent,
  ],
  providers: [
    ComponentListFormService,
    ComponentListRepositoryService,
    ComponentListToolsService,
    AddressHelperService,
    DictionaryApiService,
  ]
})
export class ComponentsListModule { }
