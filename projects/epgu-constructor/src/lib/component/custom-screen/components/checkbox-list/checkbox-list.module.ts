import { NgModule } from '@angular/core';
import { CheckboxListComponent } from './checkbox-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstructorCheckboxModule } from '@epgu/epgu-constructor-ui-kit';

@NgModule({
  declarations: [CheckboxListComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConstructorCheckboxModule],
  exports: [CheckboxListComponent],
})
export class CheckboxListModule { }