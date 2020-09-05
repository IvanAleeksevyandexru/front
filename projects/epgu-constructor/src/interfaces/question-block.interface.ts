import { ComponentBase, Display } from '../app/services/api/form-player-api/form-player-api.types';


export interface QuestionsDisplayInterface extends Display {
  components: Array<QuestionsComponentInterface>;
}

interface QuestionsComponentInterface extends ComponentBase {
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
