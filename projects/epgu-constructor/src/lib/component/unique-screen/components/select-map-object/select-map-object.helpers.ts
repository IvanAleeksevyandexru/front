import {
  DictionaryConditions,
  DictionaryOptions,
  DictionaryUnionKind,
} from '@epgu/epgu-constructor-types';

/**
 * Возвращает опции атрибута запроса доступности оплаты в ГИБДД
 * @param id - объект фильтра для оплаты
 */
export const getPaymentRequestOptionGIBDD = (id: string): DictionaryOptions => {
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

export const arePointsEqual = (point1: {center: number[], title: string}, point2: {center: number[], title: string}): boolean => {
  return point2
    && point1
    && point1.center
    && point2.center
    && point1.center[0] === point2.center[0]
    && point1.center[1] == point2.center[1]
    && point1.title === point2.title;
};
