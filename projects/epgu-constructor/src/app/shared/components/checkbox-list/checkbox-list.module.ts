import { NgModule } from '@angular/core';
import { CheckboxListComponent } from './components/checkbox-list/checkbox-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstructorCheckboxModule } from '../constructor-checkbox/constructor-checkbox.module';

@NgModule({
  declarations: [CheckboxListComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConstructorCheckboxModule],
  exports: [CheckboxListComponent],
})
export class CheckboxListModule { }