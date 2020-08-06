import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPersonalUserDataScreenComponent } from './confirm-personal-user-data-screen.component';
import { SharedComponentsModule } from '../../../../../../module-share/shared-components.module';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { EpguLibModule } from 'epgu-lib';
import {ConfirmPersonalUserDataComponent} from './component/confirm-personal-user-data/confirm-personal-user-data.component';

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
    SharedComponentsModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class ConfirmPersonalUserDataScreenModule { }
