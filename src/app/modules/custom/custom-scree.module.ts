import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomScreenComponent } from './components/custom-screen/custom-screen.component';

const COMPONENTS = [
  CustomScreenComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  exports: [
    CustomScreenComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CustomScreeModule { }
