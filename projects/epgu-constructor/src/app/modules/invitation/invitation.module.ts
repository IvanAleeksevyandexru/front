import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './components/root/root.component';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
import { SharedModule } from '../../shared-module/shared-components.module';
import { EpguLibModule } from 'epgu-lib';

const COMPONENTS = [
  InvitationErrorComponent,
  RootComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    EpguLibModule
  ]
})
export class InvitationModule { }
