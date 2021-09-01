import { Clarifications } from './clarifications';

export interface ComponentAnswerDto {
  attrs?: {
    clarifications?: Clarifications;
  };
  label: string;
  value: string;
  type: string;
  action: string;
  hidden?: boolean;
  disabled?: boolean;
  link?: string;
  hint?: string;
  underConstruction?: boolean;
  description?: string; // описание для вопроса
  modalHtml?: string;
}
