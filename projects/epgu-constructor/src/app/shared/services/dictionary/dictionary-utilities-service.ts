import { IdictionaryFilter } from '../../../component/unique-screen/components/select-map-object/select-map-object.interface';
import { CachedAnswers, ScreenStore } from '../../../screen/screen.types';
import {
  DictionaryFilters,
  DictionaryItem,
  DictionaryValue
} from '../../../component/shared/services/dictionary-api/dictionary-api.types';
import { ListItem } from 'epgu-lib';

export type ComponentValue = {
  [key: string]: string | number
};

export class DictionaryUtilities {

  /**
   * Подготавливает объект с фильтрами для получения словаря
   * @param componentValue значение value пришедшение с бэкэнда
   * @param scenarioDto значение scenarioDto пришедшение с бэкэнда
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  public static getFilterOptions(
    componentValue: ComponentValue,
    screenStore: ScreenStore,
    dictionaryFilters?: Array<IdictionaryFilter>,
  ): DictionaryFilters {
    const filters = dictionaryFilters.map((dFilter: IdictionaryFilter) => {
      return {
        simple: {
          attributeName: dFilter.attributeName,
          condition: dFilter.condition,
          value: this.getValueForFilter(componentValue, screenStore, dFilter),
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
   * Получение значения типа ref из dictionaryFilter (настроечный JSON) из applicantAnswers по пути path
   * @param applicantAnswers ответы с экранов в scenarioDto
   * @param path путь до значения в applicantAnswers (примеp: pd1.value.firstName)
   */
  private static getValueViaRef(applicantAnswers: CachedAnswers, path: string): string {
    return path.split('.').reduce((ret: ComponentValue | string, current, index) => {
      // Eсли путь ссылается на поле в value, то его (value) необходимо предварительно распарсить, всегда index === 2
      if (index === 2) {
        ret = JSON.parse(ret as string);
      }
      return ret[current];
    }, applicantAnswers);
  }

  /**
   * Получение значение для фильтра dictionary
   * @param componentValue значение value пришедшение с бэкэнда
   * @param scenarioDto значение scenarioDto пришедшение с бэкэнда
   * @param dFilter фильтр из атрибутов компонента
   */
  private static getValueForFilter(componentValue: ComponentValue, screenStore: ScreenStore, dFilter: IdictionaryFilter): DictionaryValue {
    const filterTypes = {
      value: (dFilter): DictionaryValue => JSON.parse(dFilter.value),
      preset: (dFilter): DictionaryValue => ({ asString: componentValue[dFilter.value] as string }),
      root: (dFilter): DictionaryValue => ({ asString: screenStore[dFilter.value] }),
      ref: (dFilter): DictionaryValue => ({ asString: this.getValueViaRef(screenStore.applicantAnswers, dFilter.value) }),
    };
    return filterTypes[dFilter.valueType](dFilter);
  }

  /**
   * Мапим словарь в ListItem для компонента EPGU отвечающий за список
   * @param items массив элементов словаря
   */
  public static adaptDictionaryToListItem(items: Array<DictionaryItem>): Array<Partial<ListItem>> {
    return items.map((item) => ({
      originalItem: item,
      id: item.value,
      text: item.title,
    }));
  }

}
