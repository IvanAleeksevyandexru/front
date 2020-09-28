import { Component, Input, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormControl, FormGroup } from '@angular/forms';
import * as moment_ from 'moment';
import { map, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { ComponentStateService } from '../../../../components/component-state.service';
import { DATE_STRING_DOT_FORMAT } from '../../../../shared/constants/dates';
import { ComponentBase } from '../../../screen.types';
import { TextTransform } from '../../../../shared/types/textTransform';

const moment = moment_;

export interface DocInputComponentInterface extends ComponentBase {
  attrs: {
    fields: Array<IField>;
    fstuc?: TextTransform;
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
  selector: 'epgu-constructor-doc-input',
  templateUrl: './doc-input.component.html',
  styleUrls: ['./doc-input.component.scss'],
  providers: [UnsubscribeService],
})
export class DocInputComponent implements OnInit {
  @Input() data: DocInputComponentInterface;

  form = new FormGroup({});
  readonly maxDate = new Date();

  constructor(
    private ngUnsubscribe$: UnsubscribeService,
    private componentStateService: ComponentStateService,
  ) {}

  ngOnInit(): void {
    this.generateFormGroup();
  }

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }

  private generateFormGroup(): void {
    this.data.attrs.fields.forEach((field: IField) => {
      this.form.addControl(field.fieldName, new FormControl());
    });

    this.form.valueChanges
      .pipe(
        map((form: IForm) => ({
          ...form,
          date: moment(form.date).format(DATE_STRING_DOT_FORMAT),
        })),
        takeUntil(this.ngUnsubscribe$),
      )
      .subscribe((next: IForm) => {
        this.componentStateService.state = next;
      });
  }
}
