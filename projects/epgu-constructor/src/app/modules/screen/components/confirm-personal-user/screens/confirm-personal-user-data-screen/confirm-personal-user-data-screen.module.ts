import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserDataScreenComponent } from './confirm-personal-user-data-screen.component';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { EpguLibModule } from 'epgu-lib';
import { ConfirmPersonalUserDataComponent } from './component/confirm-personal-user-data/confirm-personal-user-data.component';
import { SharedModule } from '../../../../../../shared-module/shared-components.module';

const COMPONENTS = [
  ConfirmPersonalUserDataScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS,
    ConfirmPersonalUserDataComponent,
    ],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ConfirmPersonalUserDataScreenModule { }
