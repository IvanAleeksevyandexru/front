import { ScenarioDto } from '../form-player-api/form-player-api.types';

export interface ActionApiDTO<T = {}> {
  scenarioDto: Partial<ScenarioDto>;
  additionalParams?: T;
}

export interface ActionApiResponse<T> {
  errorList: { [key: string]: any }[];
  responseData: { value: T; type: string };
}
