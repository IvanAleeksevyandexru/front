import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Observable } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ListItem } from '@epgu/ui/models/dropdown';
import MvdGiacLookupModelAttrs from './MvdGiacLookupModelAttrs';
import AbstractDropdownLikeComponent from '../abstract-component-list-item/abstract-dropdown-like.component';

@Component({
  selector: 'epgu-constructor-mvd-giac-lookup',
  templateUrl: './mvd-giac-lookup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class MvdGiacLookupComponent extends AbstractDropdownLikeComponent<MvdGiacLookupModelAttrs>
  implements OnInit {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  clearable = true;
  queryMinSymbolsCount = 0;
  searchCaseSensitive = false;
  virtualScroll = true;
  dropDown$: Observable<Partial<ListItem>[]>;

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dropDown$ = this.model.dropDown$;
  }
}
