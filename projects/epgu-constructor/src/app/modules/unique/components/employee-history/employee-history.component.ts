import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { ComponentInterface, TGender } from '../../../../../interfaces/epgu.service.interface';
import { EmployeeHistoryFormService } from './services/employee-history.form.service';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { EmployeeHistoryDatasourceService } from './services/employee-history.datasource.service';
import { IEmployeeHistoryDataSource } from '../../../../../interfaces/employee-history.interface';

@Component({
  selector: 'epgu-constructor-employee-history',
  templateUrl: './employee-history.component.html',
  styleUrls: ['./employee-history.component.scss'],
})
export class EmployeeHistoryComponent implements OnInit {
  @Input() data: ComponentInterface;
  @Input() header: string;
  @Input() gender: TGender;

  ds: Array<IEmployeeHistoryDataSource>;
  generateForm: FormGroup;

  constructor(
    public employeeFormService: EmployeeHistoryFormService,
    private unsubscribeService: UnsubscribeService,
    private datasourceService: EmployeeHistoryDatasourceService,
  ) {}

  ngOnInit(): void {
    this.ds = this.datasourceService.getDataSourceByGender(this.gender);
    this.generateForm = this.employeeFormService.createEmployeeForm();
    this.generateFormWatcher();
  }

  resetForm(currentType: number): void {
    this.generateForm.reset();
    this.generateForm.get('type').patchValue(currentType);
  }

  pushFormGroup(): void {
    this.employeeFormService.employeeHistory.push(this.generateForm.getRawValue());
    this.resetForm(0);
  }

  removeFormGroup(index: number): void {
    this.employeeFormService.employeeHistory.splice(index, 1);
  }

  private generateFormWatcher(): void {
    this.generateForm
      .get('checkboxToDate')
      .valueChanges.pipe(
        filter((checked: boolean) => checked),
        takeUntil(this.unsubscribeService),
      )
      .subscribe(() => this.generateForm.get('to').patchValue(new Date()));
  }
}
