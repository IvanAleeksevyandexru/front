import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from '../../module-share/shared-components.module';
import { RootComponent } from './components/root/root.component';
import { InvitationErrorComponent } from './components/error/invitation-error.component';

const COMPONENTS = [
  InvitationErrorComponent,
  RootComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedComponentsModule
  ]
})
export class InvitationModule { }
