import { IdictionaryFilter } from './select-map-object.interface';
import { ScenarioDto } from '../../../../services/api/form-player-api/form-player-api.types';

export class Utilities {

  /**
   * Подготавливает объект с фильтрами для получения словаря
   * @param componentValue значение value пришедшение с бэкэнда
   * @param scenarioDto значение scenarioDto пришедшение с бэкэнда
   * @param dictionaryFilters фильтры из атрибутов компонента
   */
  public static getFilterOptions(componentValue: any, scenarioDto: any, dictionaryFilters?: Array<IdictionaryFilter>) {
    const filters = dictionaryFilters.map((dFilter) => {
      return {
        simple: {
          attributeName: dFilter.attributeName,
          condition: dFilter.condition,
          value: this.getValueForFilter(componentValue, scenarioDto, dFilter),
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
   * @param path путь до значения в applicantAnswers
   */
  private static getValueViaRef(applicantAnswers, path) {
    return path.split('.').reduce((ret, current, index) => {
      // Eсли путь ссылается на поле в value, то его (value) необходимо предварительно распарсить, всегда index === 2
      if (index === 2) {
        ret = JSON.parse(ret);
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
  private static getValueForFilter(componentValue: any, scenarioDto: ScenarioDto, dFilter: IdictionaryFilter) {
    const filterTypes = {
      value: (dFilter) => JSON.parse(dFilter.value),
      preset: (dFilter) => ({ asString: componentValue[dFilter.value] }),
      root: (dFilter) => ({ asString: scenarioDto[dFilter.value] }),
      ref: (dFilter) => ({ asString: this.getValueViaRef(scenarioDto.applicantAnswers, dFilter.value) }),
    };
    return filterTypes[dFilter.valueType](dFilter);
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
