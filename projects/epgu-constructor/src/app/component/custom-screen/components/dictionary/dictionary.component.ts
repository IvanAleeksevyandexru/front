import { Component, ChangeDetectionStrategy, Injector } from '@angular/core';
import { ValidationShowOn } from 'epgu-lib';

import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../screen/screen.service';
import { CustomComponent } from '../../components-list.types';
import { UtilsService } from '../../../../core/services/utils/utils.service';

@Component({
  selector: 'epgu-constructor-dictionary',
  templateUrl: './dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DictionaryComponent extends AbstractComponentListItemComponent {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    public injector: Injector,
    public suggestHandlerService: SuggestHandlerService,
    public dictionaryToolsService: DictionaryToolsService,
    public screenService: ScreenService,
  ) {
    super(injector);
  }

  public getDictKeyByComp(component: CustomComponent): string {
    return UtilsService.getDictKeyByComp(component);
  }
}
