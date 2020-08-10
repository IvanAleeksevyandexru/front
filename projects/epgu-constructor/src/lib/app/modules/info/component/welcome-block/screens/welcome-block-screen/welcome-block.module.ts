import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WelcomeScreenComponent} from './welcome-screen.component';

const COMPONENTS = [
  WelcomeScreenComponent
];

@NgModule({
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS],
  imports: [
    CommonModule,
  ]
})
export class WelcomeBlockModule { }
