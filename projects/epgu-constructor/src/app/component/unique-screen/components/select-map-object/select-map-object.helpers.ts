/**
 * Возвращает опции атрибута запроса доступности оплаты в ГИБДД
 * @param id - объект фильтра для оплаты
 */
import {
  DictionaryConditions,
  DictionaryOptions,
  DictionaryUnionKind
} from '../../../../core/services/dictionary/dictionary-api.types';

export const getPaymentRequestOptionGIBDD = (id: number): DictionaryOptions => {
  return {
    treeFiltering: 'ONELEVEL',
    filter: {
      union: {
        unionKind: DictionaryUnionKind.AND,
        subs: [
          {
            simple: {
              attributeName: 'OFFICE_FRGU',
              condition: DictionaryConditions.CONTAINS,
              value: {
                asString: `${id}`,
              },
            },
          },
        ],
      },
    },
    pageNum: 1,
    pageSize: '258',
    parentRefItemValue: '',
    selectAttributes: ['*'],
    tx: '46f4bfad-d6de-11ea-9135-fa163e1007b9',
  };
};
