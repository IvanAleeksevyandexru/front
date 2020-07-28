import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WelcomeScreenComponent} from './components/welcome-screen/welcome-screen.component';
import {EpguLibModule} from 'epgu-lib';
import {ConstructorComponent} from './constructor.component';

const COMPONENTS = [
  WelcomeScreenComponent,
  ConstructorComponent
]

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    EpguLibModule.forChild(),
  ],
  providers: [],
  exports: [
    ...COMPONENTS
  ]
})

export class ConstructorModule { }
