import { ComponentDto } from './component-dto';
import { ActionConfirmationsDto, DisplaySubjHead } from './component-attrs';
import { ScreenButton } from './screen-buttons';
import { SuggestionGroup } from './suggestion';

/**
 * @property {}components
 * @property {boolean}firstScreen - ствойсвто отвечает на вопрос, на первом ли экране мы находимся,
 * если экран не первый то свойства не должно быть
 * @property {string}header - текстовый заголовок компонента
 * @property {string}id - идентификатор экрана
 * @property {string}name - краткая информация о том что за компонент (на фронте не используется)
 * @property {string}submitLabel - текст для submit-button'a
 * @property {ScreenTypes}type - тип компонента
 */
export interface DisplayDto {
  id: string;
  name: string;
  header: string;
  submitLabel?: string; // TODO: depricated удалить после переезда на buttons
  components: Array<ComponentDto>;
  type: ScreenTypes;
  terminal: boolean;
  firstScreen?: boolean;
  subHeader?: DisplaySubjHead;
  confirmations?: ActionConfirmationsDto;
  label?: string;
  cssClass?: string;
  isSocialButtonsHidden?: boolean;
  displayCssClass?: string;
  buttons?: Array<ScreenButton>;
  infoComponents?: string[];
  suggestion?: SuggestionGroup;
  hideBackButton?: boolean;
}

export enum ScreenTypes {
  QUESTION = 'QUESTION',
  INFO = 'INFO',
  CUSTOM = 'CUSTOM',
  REPEATABLE = 'REPEATABLE',
  UNIQUE = 'UNIQUE',
  INVITATION_ERROR = 'INVITATION_ERROR',
  EMPTY = 'EMPTY',
  APP = 'APP',
}
