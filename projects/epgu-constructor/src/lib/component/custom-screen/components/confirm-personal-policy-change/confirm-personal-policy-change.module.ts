import { NgModule } from '@angular/core';
import { BaseModule } from '../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../shared/components/base-components/base-components.module';
import { InputErrorModule } from '@epgu/epgu-constructor-ui-kit';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { FieldListModule } from '../../../../shared/components/field-list/field-list.module';
import { ConfirmPersonalPolicyChangeComponent } from './confirm-personal-policy-change.component';

@NgModule({
  declarations: [ConfirmPersonalPolicyChangeComponent],
  exports: [ConfirmPersonalPolicyChangeComponent],
  imports: [
    BaseModule,
    ConstructorPlainInputModule,
    BaseComponentsModule,
    InputErrorModule,
    FieldListModule,
  ],
  providers: [],
})
export class ConfirmPersonalPolicyChangeModule {}
