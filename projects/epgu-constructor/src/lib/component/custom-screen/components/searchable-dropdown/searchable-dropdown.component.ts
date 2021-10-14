import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { Component, ChangeDetectionStrategy, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { ListItem } from '@epgu/ui/models/dropdown';
import SearchableDropdownModelAttrs from './SearchableDropdownModelAttrs';
import AbstractDropdownLikeComponent from '../abstract-component-list-item/abstract-dropdown-like.component';

@Component({
  selector: 'epgu-constructor-searchable-dropdown',
  templateUrl: './searchable-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [UnsubscribeService],
})
export class SearchableDropdownComponent
  extends AbstractDropdownLikeComponent<SearchableDropdownModelAttrs>
  implements OnInit {
  public validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  public clearable = true;
  public queryMinSymbolsCount = 0;
  public searchCaseSensitive = false;
  public virtualScroll = true;
  dropDown$: Observable<Partial<ListItem>[]>;

  public constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dropDown$ = this.model.dropDown$;
  }
}
