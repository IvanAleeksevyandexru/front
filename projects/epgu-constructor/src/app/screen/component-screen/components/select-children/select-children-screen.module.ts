import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { ScreenService } from '../../../../screen/screen.service';
import { CachedAnswersService } from '../../../../shared/services/applicant-answers/cached-answers.service';
import { SharedModule } from '../../../../shared/shared.module';
import { SelectChildrenScreenComponent } from './select-children-screen.component';

const COMPONENTS = [ SelectChildrenScreenComponent ];

@NgModule({
  declarations: [ ...COMPONENTS ],
  imports: [
    CommonModule,
    EpguLibModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  exports: [ ...COMPONENTS ],
  providers: [
    ScreenService,
    CachedAnswersService,
  ]
})
export class SelectChildrenScreenModule { }
