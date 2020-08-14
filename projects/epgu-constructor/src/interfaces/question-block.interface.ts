import { ComponentInterface, DisplayInterface } from './epgu.service.interface';


export interface QuestionsDisplayInterface extends DisplayInterface {
  components: Array<QuestionsComponentInterface>;
}

interface QuestionsComponentInterface extends ComponentInterface {
  attrs: {
    actions: Array<QuestionsComponentActionsInterface>
  }
}

export interface QuestionsComponentActionsInterface {
  action: string;
  label: string;
  value: string;
}
