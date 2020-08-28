import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeHistoryModel } from '../../../../../../interfaces/employee-history.interface';

@Injectable({
  providedIn: 'root'
})
export class EmployeeHistoryFormService {
  employeeHistory: Array<EmployeeHistoryModel> = [];

  constructor(private fb: FormBuilder) {}

  createEmployeeForm(): FormGroup {
    return this.fb.group({
      type: [0],
      from: [null],
      to: [null],
      position: [null],
      place: [null],
      address: [null],
      checkboxToDate: [false]
    });
  }
}
