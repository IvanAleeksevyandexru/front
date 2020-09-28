import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';

import { SharedModule } from '../../../../shared/shared.module';
import { SignatureApplicationComponent } from './components/signature-application.component';

const COMPONENTS = [SignatureApplicationComponent];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  providers: [],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, EpguLibModule],
})
export class SignatureApplicationModule {}
