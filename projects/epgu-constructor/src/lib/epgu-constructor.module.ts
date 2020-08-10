import { NgModule } from '@angular/core';
import {EpguConstructorComponent} from './epgu-constructor.component';

const COMPONENT = [
  EpguConstructorComponent,
]

@NgModule({
  declarations: [...COMPONENT],
  imports: [
  ],
  exports: [...COMPONENT]
})
export class EpguConstructorModule { }
