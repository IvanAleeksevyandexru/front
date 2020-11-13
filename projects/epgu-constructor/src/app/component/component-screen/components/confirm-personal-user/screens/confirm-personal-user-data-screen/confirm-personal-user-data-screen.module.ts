import { NgModule } from '@angular/core';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';

const COMPONENTS = [
  ConfirmPersonalUserDataComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserDataScreenModule { }
