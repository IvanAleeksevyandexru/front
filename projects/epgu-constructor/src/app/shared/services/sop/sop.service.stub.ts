import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SopItem, SopMapOptions } from './sop.types';
import { ListElement } from 'epgu-lib/lib/models/dropdown.model';

@Injectable()
export class SopServiceStub {

  public getDictionary(): Observable<{items: any[]}> {
    return of({
      items: []
    });
  }

  public adaptResponseToListItem(
    items: Array<SopItem>,
    options: SopMapOptions = {},
  ): Array<ListElement> {
    return items.map((item: SopItem) => ({
      originalItem: item,
      id: (options.key ? item[options.key] : item.value) as string,
      text: (options.value ? item[options.value] : item.title) as string,
    }));
  }

  private post(): Observable<{}> {
    return of({});
  }
}
