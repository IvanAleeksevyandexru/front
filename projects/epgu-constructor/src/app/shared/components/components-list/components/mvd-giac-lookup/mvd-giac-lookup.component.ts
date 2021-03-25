import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CustomListDropDowns } from '../../components-list.types';
import { DictionaryToolsService } from '../../../../services/dictionary/dictionary-tools.service';

@Component({
  selector: 'epgu-constructor-mvd-giac-lookup',
  templateUrl: './mvd-giac-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MvdGiacLookupComponent {
  @Input() control: FormGroup | AbstractControl;
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  clearable = true;
  queryMinSymbolsCount = 0;
  searchCaseSensitive = false;
  virtualScroll = true;
  dropDowns$: BehaviorSubject<CustomListDropDowns> = this.dictionaryToolsService.dropDowns$;

  constructor(private dictionaryToolsService: DictionaryToolsService) {}
}