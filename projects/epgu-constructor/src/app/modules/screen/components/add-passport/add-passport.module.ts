import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {AddPassportComponent} from './add-passport.component';
import {EpgucSharedModule} from '../../../../shared-module/shared-components.module';

const COMPONENTS = [ AddPassportComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    EpgucSharedModule,
    EpguLibModule.forChild(),
    EpgucSharedModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class AddPassportModule { }
