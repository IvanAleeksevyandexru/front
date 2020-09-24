import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddChildrenScreenComponent } from './add-children-screen.component';
import { EpguLibModule } from 'epgu-lib';
import { SubComponentsModule } from '../../sub-components/sub-components.module';
import { SharedModule } from '../../../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [ AddChildrenScreenComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    SubComponentsModule,
    EpguLibModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [ ...COMPONENTS ]
})
export class AddChildrenScreenModule { }
