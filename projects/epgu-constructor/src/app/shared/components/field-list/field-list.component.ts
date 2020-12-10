import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  ConfirmUserDataFieldsState,
  ConfirmUserDataState,
  ConfirmUserDataStyle,
} from '../../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/confirm-personal-user-data-screen.types';
import { ComponentDto } from '../../../form-player/services/form-player-api/form-player-api.types';

@Component({
  selector: 'epgu-constructor-field-list',
  templateUrl: './field-list.component.html',
  styleUrls: ['./field-list.component.scss'],
})
export class FieldListComponent implements OnInit, OnChanges {
  @Input() data: ComponentDto;

  public preparedData: Array<ConfirmUserDataFieldsState> = [];
  public style: ConfirmUserDataStyle;

  ngOnInit(): void {
    this.style = this.data.attrs.style;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.data?.currentValue) {
      const { states } = JSON.parse(this.data.value) as ConfirmUserDataState;
      this.preparedData = states;
    }
  }
}
