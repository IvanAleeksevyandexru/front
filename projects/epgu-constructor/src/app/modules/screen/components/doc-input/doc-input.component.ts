import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import * as moment_ from 'moment';
import { EgpuResponseComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { CONSTANTS } from '../../../../../constant/global';

const moment = moment_;

interface EgpuResponseComponentInterfaceForDocInput extends EgpuResponseComponentInterface {
  attrs: {
    fields: Array<IField>;
  };
}
interface IField {
  fieldName: string;
  label: string;
  type: 'input';
}

interface IForm {
  series: string;
  number: string;
  date: string;
  emiter: string;
}

@Component({
  selector: 'app-doc-input',
  templateUrl: './doc-input.component.html',
  styleUrls: ['./doc-input.component.scss'],
})
export class DocInputComponent implements OnInit, OnDestroy {
  @Input() data: EgpuResponseComponentInterfaceForDocInput;
  @Output() nextStepEvent = new EventEmitter<any>();

  private ngUnsubscribe$ = new Subject<void>();

  form = new FormGroup({});
  readonly maxDate = new Date();

  ngOnInit(): void {
    this.generateFormGroup();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private generateFormGroup(): void {
    this.data.attrs.fields.forEach((field: IField) => {
      this.form.addControl(field.fieldName, new FormControl());
    });

    this.form.valueChanges
      .pipe(
        map((form: IForm) => ({
          ...form,
          date: moment(form.date).format(CONSTANTS.dateFormat),
        })),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((next: IForm) => this.nextStepEvent.emit(next));
  }
}
