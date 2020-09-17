import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { AddPassportComponent } from './add-passport.component';
import { SharedModule } from '../../../../shared/shared.module';

const COMPONENTS = [ AddPassportComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    EpguLibModule,
    SharedModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class AddPassportModule { }
