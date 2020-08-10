import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpgucSharedModule } from '@epgu-constructor';
import { RootComponent } from './components/root/root.component';
import { InvitationErrorComponent } from './components/error/invitation-error.component';
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
    EpgucSharedModule,
    EpguLibModule
  ]
})
export class InvitationModule { }
