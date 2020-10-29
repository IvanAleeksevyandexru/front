import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { EpguLibModule } from 'epgu-lib';
import { InvitationErrorComponent } from './components/error/invitation-error.component';

const COMPONENTS = [
  InvitationErrorComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule
  ],
  providers: []
})
export class InvitationErrorScreenComponentsModule { }
