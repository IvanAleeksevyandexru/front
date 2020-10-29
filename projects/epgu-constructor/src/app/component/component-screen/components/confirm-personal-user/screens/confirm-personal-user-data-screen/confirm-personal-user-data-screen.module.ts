import { NgModule } from '@angular/core';
import { ConfirmPersonalUserDataScreenComponent } from './confirm-personal-user-data-screen.component';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CoreModule } from '../../../../../../core/core.module';

const COMPONENTS = [
  ConfirmPersonalUserDataScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS,
    ConfirmPersonalUserDataComponent,
    ],
  exports: [...COMPONENTS],
  imports: [
    CoreModule,
    SharedModule,
    SubComponentsModule,
  ]
})
export class ConfirmPersonalUserDataScreenModule { }
