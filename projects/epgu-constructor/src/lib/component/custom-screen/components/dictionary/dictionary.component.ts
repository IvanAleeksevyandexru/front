import { Component, ChangeDetectionStrategy, Injector, OnInit } from '@angular/core';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ListItem } from '@epgu/ui/models/dropdown';
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

  constructor(public injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.list$ = this.model.dictionary$.pipe(map((dictionary) => dictionary.list));
    this.list$.subscribe((data) => {
      if (data?.length === 1 && data[0].id && data[0].text) {
        this.control.get('value').setValue(data[0]);
      }
    });
  }
}
