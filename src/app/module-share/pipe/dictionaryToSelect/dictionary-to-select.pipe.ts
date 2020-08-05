import { Pipe, PipeTransform } from '@angular/core';
import {DictionaryItem} from '../../../interfaces/dictionary-options.interface';
import {ListItem} from 'epgu-lib';


@Pipe({
  name: 'dictionaryToSelect'
})
export class DictionaryToSelectPipe implements PipeTransform {

  transform(value: Array<DictionaryItem> /*| DictionaryItem*/): Array<ListItem> | []/* | ListItem*/{
    if (value) {
      return /*Array.isArray(value) ?*/
        value.map(item => this.adaptiveData(item))/* :
        this.adaptiveData(value)*/;
    } else {
      return [];
    }
  }


  /**
   * Адаптирует данные под компонент select
   * @param item
   */
  private adaptiveData(item: DictionaryItem): ListItem {
    return ({
      id: item.value,
      text: item.title,
      formatted: '',
      // 'hidden': false,
      originalItem: item,
      compare: () => false
    });
  }
}
