import { Component, ChangeDetectionStrategy, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ListItem } from '@epgu/ui/models/dropdown';
import { defer } from 'lodash';
import DictionaryModelAttrs from './DictionaryModelAttrs';
import AbstractDictionaryLikeComponent from '../abstract-component-list-item/abstract-dictionary-like.component';

@Component({
  selector: 'epgu-constructor-dictionary',
  templateUrl: './dictionary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DictionaryComponent extends AbstractDictionaryLikeComponent<DictionaryModelAttrs>
  implements OnInit {
  validationShowOn = ValidationShowOn.TOUCHED_UNFOCUSED;
  list$: Observable<ListItem[]>;

  public constructor(public injector: Injector) {
    super(injector);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.list$ = this.model.dictionary$.pipe(map((dictionary) => dictionary.list));
    this.list$.subscribe((data) => {
      if (this.isOneElement(data)) {
        defer(() => this.control.get('value').setValue(data[0]));
      }
    });
  }

  public isOneElement(items: ListItem[]): boolean {
    return items?.length === 1 && items[0].id && items[0].text && !this.attrs?.isClearable;
  }
}
