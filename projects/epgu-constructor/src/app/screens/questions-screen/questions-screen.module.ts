import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { QuestionsScreenComponent } from './questions-screen.component';
import { SharedModule } from '../../shared/shared.module';


const COMPONENTS = [
  QuestionsScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
    imports: [
        CommonModule,
        SharedModule,
        EpguLibModule,
    ]
})
export class QuestionsScreenModule { }

