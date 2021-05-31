/**
 * Направление относительно внешней APP, по анологии с props в Angular.
 * Данные передаваемые от CF к SPA обозначаем как INPUT.
 * Данные передаваемые от SPA к CF обозначаем как OUTPUT.
 */
export enum DataDirectionType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const APP_INPUT_KEY = 'APP_INPUT';
export const APP_OUTPUT_KEY = 'APP_OUTPUT';
