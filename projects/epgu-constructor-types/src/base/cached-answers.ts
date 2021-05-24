import { Answer } from './answer';

export interface CachedAnswersDto {
  [key: string]: Answer;
}
