import { ValidationShowOn } from '@epgu/epgu-lib';
import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';

@Component({
  selector: 'epgu-constructor-dropdown',
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent extends AbstractComponentListItemComponent {
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public injector: Injector,
    public dictionaryToolsService: DictionaryToolsService,
    public screenService: ScreenService,
    public suggestHandlerService: SuggestHandlerService,
  ) {
    super(injector);
  }
}
