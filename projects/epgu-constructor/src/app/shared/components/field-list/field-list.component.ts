import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ConfirmUserDataStyle, ComponentDto } from 'epgu-constructor-types';
import {
  ConfirmUserDataError,
  ConfirmUserDataFieldsState,
  ConfirmUserDataState,
} from '../../../component/unique-screen/components/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';

const defaultStyle: ConfirmUserDataStyle = {
  group: 'mb-16',
  groupTitle: 'mb-12',
  value: '',
  label: 'mb-4',
  field: 'mb-16',
  list: '',
  divider: 'mb-32',
};

@Component({
  selector: 'epgu-constructor-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FieldListComponent implements OnInit, OnChanges {
  @Input() data: ComponentDto;

  public preparedData: Array<ConfirmUserDataFieldsState> = [];
  public style: ConfirmUserDataStyle;
  public errors: ConfirmUserDataError[];

  ngOnInit(): void {
    this.style = this.data.attrs?.style || defaultStyle;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      const { states, errors = [] } = (this.data.presetValue
        ? JSON.parse(this.data.presetValue)
        : JSON.parse(this.data.value)) as ConfirmUserDataState;
      this.preparedData = states;
      this.errors = errors;
    }
  }
}
