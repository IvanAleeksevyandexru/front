import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ValidationService } from './services/validation.service';
import { AddressHelperService } from './services/address-helper.service';
import { ComponentListToolsService } from './services/component-list-tools.service';
import { ComponentsListComponent } from './components-list.component';
import { DictionaryApiService } from '../shared/services/dictionary-api/dictionary-api.service';
import { CoreModule } from '../../core/core.module';
import { ComponentItemComponent } from './component-item/component-item.component';
import { DocInputComponent } from './doc-input/doc-input.component';
import { TimerModule } from '../component-screen/components/timer/timer.module';
import { ConstructorPlainInputModule } from '../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { ConstructorMaskedInputModule } from '../../shared/components/epgu-lib/constructor-masked-input/constructor-masked-input.module';
import { PassportModule } from '../../shared/components/add-passport/passport.module';
import { ConstructorDadataWidgetModule } from '../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDropdownModule } from '../../shared/components/constructor-dropdown/constructor-dropdown.module';

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
    PassportModule,
    ConstructorDadataWidgetModule,
    ConstructorDropdownModule,
  ],
  providers: [
    ValidationService,
    AddressHelperService,
    ComponentListToolsService,
    DictionaryApiService
  ]
})
export class ComponentsListModule { }
