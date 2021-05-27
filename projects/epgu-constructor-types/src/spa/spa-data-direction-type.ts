/**
 * Направление относительно SPA, по анологии с props в Angular.
 * Данные передаваемые от CF к SPA обозначаем как INPUT.
 * Данные передаваемые от SPA к CF обозначаем как OUTPUT.
 */
export enum SpaDataDirectionType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

export const SPA_INPUT_KEY = 'SPA_INPUT';
export const SPA_OUTPUT_KEY = 'SPA_OUTPUT';
