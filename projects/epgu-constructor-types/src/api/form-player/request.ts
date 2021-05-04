import { FormPlayerApiSuccessResponse } from './response';
import { ScenarioDto } from '../../base/scenario';

export interface QuizRequestDto extends FormPlayerApiSuccessResponse {
  serviceId: string;
  targetId: string;
}

export interface ActionRequestPayload<T = {}> {
  scenarioDto: Partial<ScenarioDto>;
  additionalParams?: T;
  deliriumAction?: string;
}
