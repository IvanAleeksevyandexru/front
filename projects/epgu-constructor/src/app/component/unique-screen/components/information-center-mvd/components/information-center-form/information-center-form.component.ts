import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';
import { FormControl } from '@angular/forms';

import { DictionaryItem } from '../../../../../shared/services/dictionary/dictionary-api.types';

@Component({
  selector: 'epgu-constructor-information-center-form',
  templateUrl: './information-center-form.component.html',
  styleUrls: ['./information-center-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationCenterFormComponent {
  @Input() sourceDictionaryLabel: string;
  @Input() dictionaryToRequestLabel: string;
  @Input() infoCenterList: Array<DictionaryItem>;
  @Input() sourceList: Array<ListElement>;
  @Input() isLoadingInfoCenter: boolean;
  @Output() handleSelectEvent = new EventEmitter<ListElement>();

  select = new FormControl();

  handleSelect(event: ListElement): void {
    this.handleSelectEvent.emit(event);
  }
}
