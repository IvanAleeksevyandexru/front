import { ComponentDto, DisplayDto } from '../../services/api/form-player-api/form-player-api.types';


export interface QuestionsDisplay extends DisplayDto {
  components: Array<QuestionsComponent>;
}

interface QuestionsComponent extends ComponentDto {
  attrs: {
    actions: Array<QuestionsComponentActions>;
    fields: object;
  }
}

export interface QuestionsComponentActions {
  action: string;
  label: string;
  value: string;
}
