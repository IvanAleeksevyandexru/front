import { NgModule } from '@angular/core';
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
import { ConstructorLookupModule } from '../../shared/components/constructor-lookup/constructor-lookup.module';
import { ConstructorCheckboxModule } from '../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { BaseModule } from '../../shared/components/base/base.module';
import { InputErrorModule } from '../../shared/components/input-error/input-error.module';
import { FieldListModule } from '../../shared/components/field-list/field-list.module';
import { MaskHandleModule } from '../../shared/pipes/mask-handle/mask-handle.module';
import { CurrencyModule } from '../../shared/directives/currency/currency.module';

const COMPONENTS = [ComponentsListComponent, ComponentItemComponent, DocInputComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    TimerModule,
    ConstructorPlainInputModule,
    ConstructorMaskedInputModule,
    PassportModule,
    ConstructorDadataWidgetModule,
    ConstructorDropdownModule,
    ConstructorLookupModule,
    ConstructorCheckboxModule,
    BaseModule,
    InputErrorModule,
    FieldListModule,
    MaskHandleModule,
    CurrencyModule,
  ],
  providers: [
    ValidationService,
    AddressHelperService,
    ComponentListToolsService,
    DictionaryApiService,
  ],
})
export class ComponentsListModule {}
