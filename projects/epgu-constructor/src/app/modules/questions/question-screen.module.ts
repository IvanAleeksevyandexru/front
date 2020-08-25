import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpguLibModule } from 'epgu-lib';
import { QuestionsScreenComponent } from './components/root/questions-screen.component';
import { SharedModule } from '../../shared-module/shared-components.module';


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
export class QuestionScreenModule { }

