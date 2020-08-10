import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {AddPassportScreenComponent} from './add-passport-screen.component';
import {EpgucSharedModule} from '@epgu-constructor';

const COMPONENTS = [ AddPassportScreenComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    EpguLibModule.forChild(),
    EpgucSharedModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class AddPassportScreenModule { }
