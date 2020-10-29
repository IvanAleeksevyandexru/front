import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemporaryRegistrationAddrScreenComponent } from './temporary-registration-addr-screen.component';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { TemporaryRegistrationAddrComponent } from './components/temporary-registration-addr/temporary-registration-addr.component';
import { EpguLibModule } from 'epgu-lib';
import { SharedModule } from '../../../../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [
  TemporaryRegistrationAddrScreenComponent,
  TemporaryRegistrationAddrComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    SharedModule,
    SubComponentsModule,
    EpguLibModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TemporaryRegistrationAddrScreenModule { }
