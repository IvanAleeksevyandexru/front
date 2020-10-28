import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationErrorScreenComponent } from './invitation-error-screen.component';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { SharedModule } from '../../shared/shared.module';
import { EpguLibModule } from 'epgu-lib';
import { ScreenService } from '../screen.service';

const COMPONENTS = [
  InvitationErrorComponent,
  InvitationErrorScreenComponent
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
export class InvitationErrorScreenModule { }
