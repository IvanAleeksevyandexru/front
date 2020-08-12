import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EgpuResponseComponentInterface } from '../../../../../interfaces/epgu.service.interface';

interface EgpuResponseComponentInterfaceForChangeList extends EgpuResponseComponentInterface {
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
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeListComponent implements OnChanges {
  @Input() data: EgpuResponseComponentInterfaceForChangeList;
  @Output() valueChangedEvent: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  response: Array<any>;
  fields: FormGroup;

  ngOnChanges(): void {
    this.fields = this.generateFormControls();
    this.response = [];
  }

  pushFormGroupToResponse(): void {
    if (this.fields.valid) {
      this.response.unshift(this.fields.getRawValue());
      this.fields.reset();
      this.valueChangedEvent.emit(this.response);
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
}
