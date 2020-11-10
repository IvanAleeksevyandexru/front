/**
 * Возвращает опции атрибута запроса доступности оплаты в ГИБДД
 * @param id - объект фильтра для оплаты
 */

export const getPaymentRequestOptionGIBDD = (id: number) => {
  return {
    treeFiltering: 'ONELEVEL',
    filter: {
      union: {
        unionKind: 'AND',
        subs: [
          {
            simple: {
              attributeName: 'DIV_FRGU_ID',
              condition: 'CONTAINS',
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
