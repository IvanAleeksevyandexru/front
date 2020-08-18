import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormControl, FormGroup } from '@angular/forms';
import * as moment_ from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import { map, takeUntil } from 'rxjs/operators';
import { CONSTANTS } from '../../../../../constant/global';
import { EgpuResponseComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';

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
  providers: [UnsubscribeService],
})
export class DocInputComponent implements OnInit {
  @Input() data: EgpuResponseComponentInterfaceForDocInput;
  @Output() nextStepEvent = new EventEmitter<any>();

  form = new FormGroup({});
  readonly maxDate = new Date();

  constructor(private ngUnsubscribe$: UnsubscribeService) {}

  ngOnInit(): void {
    this.generateFormGroup();
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
