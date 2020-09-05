import { ComponentInterface, DisplayInterface } from '../app/services/api/form-player-api/form-player-api.types';


export interface QuestionsDisplayInterface extends DisplayInterface {
  components: Array<QuestionsComponentInterface>;
}

interface QuestionsComponentInterface extends ComponentInterface {
  attrs: {
    actions: Array<QuestionsComponentActionsInterface>;
    fields: object;
  }
}

export interface QuestionsComponentActionsInterface {
  action: string;
  label: string;
  value: string;
}
