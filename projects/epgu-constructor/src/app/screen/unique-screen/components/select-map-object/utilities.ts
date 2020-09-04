import { IdictionaryFilter } from './select-map-object.interface';

export class Utilities {

  /**
   * Подготавливает объект с фильтрами для получения словаря
   * @param componentValue значение value пришедшение с бэкэнда
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  public static getFilterOptions(componentValue: any, dictionaryFilters?: Array<IdictionaryFilter>) {
    const filters = dictionaryFilters.map((dFilter) => {
      let filterValue;
      if (dFilter.valueType === 'value') {
        filterValue = JSON.parse(dFilter.value);
      } else if (dFilter.valueType === 'preset') {
        filterValue = { asString: componentValue[dFilter.value] };
      }
      return {
        simple: {
          attributeName: dFilter.attributeName,
          condition: dFilter.condition,
          value: filterValue,
        },
      };
    });
    return {
      filter: {
        union: {
          unionKind: 'AND',
          subs: filters,
        },
      },
    };
  }

  /**
   * Мапим словарь под формат lib-lookup из EPGU-lib
   * @param dictionaryItems массив элементов словаря
   */
  public static adaptDictionaryForLookupForSelectMap(dictionaryItems: Array<any>) {
    return dictionaryItems.map((item) => {
      return {
        originalItem: item,
        id: item.value,
        text: item.title,
      };
    });
  }

}
