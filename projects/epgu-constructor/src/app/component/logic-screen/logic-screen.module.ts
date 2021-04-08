import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogicComponent } from './logic/logic.component';



@NgModule({
    declarations: [LogicComponent],
    exports: [
        LogicComponent
    ],
    imports: [
        CommonModule
    ]
})
export class LogicScreenModule { }
