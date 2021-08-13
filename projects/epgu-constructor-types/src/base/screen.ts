import { ComponentDto } from './component-dto';
import { ActionConfirmationsDto, DisplaySubjHead } from './component-attrs';
import { ScreenButton } from './screen-buttons';
import { SuggestionGroup } from './suggestion';
import { InfoComponentDto } from './info-component-dto';

/**
 * @property {}components
 * @property {boolean}firstScreen - ствойсвто отвечает на вопрос, на первом ли экране мы находимся,
 * если экран не первый то свойства не должно быть
 * @property {string}header - текстовый заголовок компонента
 * @property {string}id - идентификатор экрана
 * @property {string}name - краткая информация о том что за компонент (на фронте не используется)
 * @property {ScreenTypes}type - тип компонента
 */
export interface DisplayDto {
  id: string;
  name: string;
  header: string;
  components: ComponentDto[];
  type: ScreenTypes;
  terminal: boolean;
  firstScreen?: boolean;
  subHeader?: DisplaySubjHead;
  confirmations?: ActionConfirmationsDto;
  label?: string;
  cssClass?: string;
  isSocialButtonsHidden?: boolean;
  displayCssClass?: string;
  buttons?: ScreenButton[];
  infoComponents?: InfoComponentDto[];
  suggestion?: SuggestionGroup;
  hideBackButton?: boolean;
  pronounceText?: string; // для умного поиска
  pronounceTextType?: string; // для умного поиска
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
