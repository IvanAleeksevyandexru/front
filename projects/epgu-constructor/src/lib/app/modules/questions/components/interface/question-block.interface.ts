import {
  EgpuResponseComponentInterface,
  EgpuResponseDisplayInterface,
  EgpuResponseInterface
} from '../../../../../interfaces/epgu.service.interface';


export interface EgpuResponseQuestionsDisplayInterface extends EgpuResponseDisplayInterface {
  components: Array<EgpuResponseQuestionsDisplayComponentInterface>;
}

interface EgpuResponseQuestionsDisplayComponentInterface extends EgpuResponseComponentInterface {
  attrs: {
    actions: Array<EgpuResponseQuestionsDisplayComponentAttrsActionsInterface>
  }
}

export interface EgpuResponseQuestionsDisplayComponentAttrsActionsInterface {
  action: string;
  label: string;
  value: string;
}
