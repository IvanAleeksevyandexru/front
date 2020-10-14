import { ComponentBase, Display } from '../screen.types';

export interface QuestionsDisplay extends Display {
  components: Array<QuestionsComponent>;
}

interface QuestionsComponent extends ComponentBase {
  attrs: {
    actions: Array<QuestionsComponentActions>;
    fields: object;
  }
}

export interface QuestionsComponentActions {
  action: string;
  label: string;
  value: string;
  disabled?: boolean;
  hidden?: boolean;
}
