import { ApplicantAnswersDto } from './applicant-answers';
import { CachedAnswersDto } from './cached-answers';
import { CurrentValueDto } from './current-value';
import { DisplayDto } from './screen';
import { Gender } from './gender';
import { LogicComponents } from './logic-component';
import { AdditionalParameters } from './additional-parameters';

/**
 * @property {Object}additionalParameters - дополнительные параметры;
 * @property {Object}applicantAnswers - состояние компонента на backend(-e), для воостановление данных.
 * @property {number}currentRule - id сценария для управление порядком компонентов (наверное не нужен для фронта)
 * @property {object}currentValue - для отправляемых данных
 * @property {DisplayDto}display - текущий экран с компонентами и данными для отрисовки
 * @property {string}gender- пол пользователя
 * @property {string}orderId - идентификатор запорлнения черновика, (уже был черновик...)
 * (человек 1, человек 2) => эти людям прилетает уведомление о подтверждении ...
 * @property {string}token - в целях разработки, на проде через cookie;
 * @property {string}userId - в целях разработки, скорее всего переедет в cookie;
 * @property {boolean}[isInternalScenarioFinish] - появляется при internal сценарии;
 * @property {string}[serviceId] - добавляется при internal сценариев(подсценариев);
 * @property {string}[currentUrl] - текущий url, нужен бэкенду для возврата на страницу, если был переход на стороннюю страницу ;
 */
export interface ScenarioDto {
  additionalParameters: AdditionalParameters;
  applicantAnswers: ApplicantAnswersDto;
  currentScenarioId: number;
  cachedAnswers: CachedAnswersDto;
  currentValue: CurrentValueDto;
  display: DisplayDto;
  errors: ScenarioErrorsDto;
  uniquenessErrors: ScenarioErrorsDto[][];
  gender: Gender;
  finishedAndCurrentScreens: string[];
  orderId: number;
  callBackOrderId?: string;
  isInternalScenario?: boolean;
  serviceId?: string;
  currentUrl?: string;
  newContactId?: string;
  logicComponents?: LogicComponents[];
  currentLogicValue: CurrentValueDto;
  isPrevStepCase?: boolean;
}

export interface ScenarioErrorsDto {
  [key: string]: string;
}
