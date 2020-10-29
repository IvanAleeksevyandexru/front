import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { SharedModule } from '../../shared/shared.module';
import { EpguLibModule } from 'epgu-lib';
import { InvitationErrorScreenComponentsModule } from '../../component/invitation-error-screen/invitation-error-screen-components.module';

const COMPONENTS = [
  InvitationErrorScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule,
    InvitationErrorScreenComponentsModule
  ],
  providers: []
})
export class InvitationErrorScreenModule { }
