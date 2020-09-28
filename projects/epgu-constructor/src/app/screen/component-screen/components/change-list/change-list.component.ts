import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CurrentAnswersService } from '../../../current-answers.service';
import { ComponentBase } from '../../../screen.types';

export interface ChangeListComponentInterface extends ComponentBase {
  attrs: {
    fields: Array<IField>;
  };
}
interface IField {
  fieldName: string;
  label: string;
  type: 'input';
}
@Component({
  selector: 'epgu-constructor-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeListComponent implements OnInit, OnChanges {
  @Input() data: ChangeListComponentInterface;
  @Output() valueChangedEvent = new EventEmitter<Array<any>>();
  response: Array<any>;
  fields: FormGroup;

  constructor(private componentStateService: CurrentAnswersService) {}

  ngOnInit(): void {
    // TODO eliskachev это для тебя нужно заполнить данные;
    this.componentStateService.state = '';
    this.fields = this.generateFormControls();
  }

  ngOnChanges(): void {
    this.fields = this.generateFormControls();
    this.response = [];
  }

  pushFormGroupToResponse(): void {
    if (this.fields.valid) {
      this.response.unshift(this.fields.getRawValue());
      this.fields.reset();
      this.componentStateService.state = this.response;
    }
  }

  private generateFormControls(): FormGroup {
    const fields: any = {};
    if (this.data) {
      this.data.attrs.fields.forEach((field) => {
        // ToDo: Пока что сделал все контролы обязательными для заполнения. Нужно будет заменить на валидацию с бэка
        fields[field.fieldName] = new FormControl(null, [Validators.required]);
      });
    }

    return new FormGroup(fields);
  }

  removeItem(item) {
    this.response = this.response.filter((el) => el !== item);
  }
}
