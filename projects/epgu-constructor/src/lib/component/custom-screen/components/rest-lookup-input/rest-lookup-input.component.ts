import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { takeUntil } from 'rxjs/operators';
import { UnsubscribeService, ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConstantsService } from '@epgu/ui/services/constants';
import { ListItem } from '@epgu/ui/models/dropdown';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { getRestDictKeyByComp } from '../../../../shared/services/dictionary/dictionary-helper';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';

@Component({
  selector: 'epgu-constructor-rest-lookup-input',
  templateUrl: './rest-lookup-input.component.html',
  styleUrls: ['./rest-lookup-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class RestLookupInputComponent extends AbstractComponentListItemComponent implements OnInit {
  public showNotFound;
  public forReRenderChildLookup = true;
  public list: ListItem[] = [];

  // eslint-disable-next-line no-restricted-globals
  queryTimeout = !isNaN(Number(this.config.lookupQueryTimeoutMs))
    ? this.config.lookupQueryTimeoutMs
    : ConstantsService.DEFAULT_QUERY_DEBOUNCE;

  readonly validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;

  constructor(
    private restToolsService: RestToolsService,
    public suggestHandlerService: SuggestHandlerService,
    private config: ConfigService,
    public injector: Injector,
  ) {
    super(injector);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.showNotFound = !!this.control.value.attrs.hint;

    this.restToolsService.dictionaries$
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((dictionaries) => {
        if (this.list !== dictionaries[getRestDictKeyByComp(this.control.value)]?.list) {
          this.list = dictionaries[getRestDictKeyByComp(this.control.value)]?.list;
          this.reRenderChildLookup();
        }
      });
  }

  private reRenderChildLookup(): void {
    setTimeout(() => {
      this.forReRenderChildLookup = false;
      this.cdr.detectChanges();
    }, 0);
    setTimeout(() => {
      this.forReRenderChildLookup = true;
      this.cdr.detectChanges();
    }, 0);
  }
}
