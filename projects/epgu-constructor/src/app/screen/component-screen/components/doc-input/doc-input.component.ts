import { Component, Input, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { map, takeUntil } from 'rxjs/operators';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../current-answers.service';
import { DATE_STRING_DOT_FORMAT } from '../../../../shared/constants/dates';
import { DocInputComponentInterface, IField, IForm } from './doc-input.types';
import { TextTransform } from '../../../../shared/types/textTransform';

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
    private componentStateService: CurrentAnswersService,
  ) {}

  ngOnInit(): void {
    this.generateFormGroup();
  }

  get textTransformType(): TextTransform {
    return this.data?.attrs?.fstuc;
  }

  private generateFormGroup(): void {
    this.data.attrs.fields.forEach((field: IField) => {
      const validators = [Validators.required];
      if (field.maxlength) {
        validators.push(Validators.maxLength(field.maxlength));
      }
      if (field.minlength) {
        validators.push(Validators.minLength(field.minlength));
      }
      this.form.addControl(field.fieldName, new FormControl(null, validators));
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
