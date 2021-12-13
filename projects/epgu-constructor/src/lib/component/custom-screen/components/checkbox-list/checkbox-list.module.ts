import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConstructorCheckboxModule } from '@epgu/epgu-constructor-ui-kit';
import { CheckboxListComponent } from './checkbox-list.component';

@NgModule({
  declarations: [CheckboxListComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ConstructorCheckboxModule],
  exports: [CheckboxListComponent],
})
export class CheckboxListModule {}
