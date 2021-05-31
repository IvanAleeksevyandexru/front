/**
 * Направление относительно внешней APP, по анологии с props в Angular.
 * Данные передаваемые от CF к SPA обозначаем как INPUT.
 * Данные передаваемые от SPA к CF обозначаем как OUTPUT.
 */
export enum DataDirectionType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}
