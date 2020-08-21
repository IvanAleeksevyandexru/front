import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EgpuResponseComponentInterface } from '../../../../../interfaces/epgu.service.interface';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';

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
export class ChangeListComponent implements OnInit, OnChanges {
  @Input() data: EgpuResponseComponentInterfaceForChangeList;
  response: Array<any>;
  fields: FormGroup;

  constructor(private screenComponentService: ScreenComponentService) {}

  ngOnInit(): void {
    // TODO eliskachev это для тебя нужно заполнить данные;
    this.screenComponentService.dataToSend = '';
  }

  ngOnChanges(): void {
    this.fields = this.generateFormControls();
    this.response = [];
  }

  pushFormGroupToResponse(): void {
    if (this.fields.valid) {
      this.response.unshift(this.fields.getRawValue());
      this.fields.reset();
      this.screenComponentService.dataToSend = this.response;
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
