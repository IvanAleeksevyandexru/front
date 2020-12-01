import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ValidationService } from './services/validation.service';
import { AddressHelperService } from './services/address-helper.service';
import { ComponentListToolsService } from './services/component-list-tools.service';
import { ComponentsListComponent } from './components-list.component';
import { ToolsService } from '../shared/services/tools/tools.service';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { CoreModule } from '../../core/core.module';
import { ComponentItemComponent } from './component-item/component-item.component';
import { DocInputComponent } from './doc-input/doc-input.component';
import { TimerModule } from '../component-screen/components/timer/timer.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../shared/components/epgu-lib/constructor-masked-input/constructor-masked-input.module';

const COMPONENTS = [
  ComponentsListComponent,
  ComponentItemComponent,
  DocInputComponent,
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
    TimerModule,
    ConstructorPlainInputModule,
    ConstructorMaskedInputModule,
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
