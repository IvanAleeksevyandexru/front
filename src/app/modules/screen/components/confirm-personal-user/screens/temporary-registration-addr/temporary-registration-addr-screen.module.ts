import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TemporaryRegistrationAddrScreenComponent} from './temporary-registration-addr-screen.component';
import {EpgucSharedModule} from '@epgu-constructor';
import {SubComponentsModule} from '../../sub-components/sub-components.module';
import { TemporaryRegistrationAddrComponent } from './components/temporary-registration-addr/temporary-registration-addr.component';
import {EpguLibModule} from 'epgu-lib';

const COMPONENTS = [
  TemporaryRegistrationAddrScreenComponent
]

@NgModule({
  declarations: [...COMPONENTS, TemporaryRegistrationAddrComponent],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
    EpgucSharedModule,
    SubComponentsModule,
    EpguLibModule.forChild(),
  ]
})
export class TemporaryRegistrationAddrScreenModule { }
