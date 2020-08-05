import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EpguLibModule} from 'epgu-lib';
import {AddPassportScreenComponent} from './add-passport-screen.component';
import {SharedComponentsModule} from '../../../../module-share/shared-components.module';

const COMPONENTS = [ AddPassportScreenComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    EpguLibModule.forChild(),
    SharedComponentsModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class AddPassportScreenModule { }
