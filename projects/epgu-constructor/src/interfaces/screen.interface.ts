import { DisplayInterface } from './epgu.service.interface';
import { EventEmitter } from '@angular/core';
import { NextStepEventData, PrevStepEventData } from './step-event-data.interface';

export interface Screen {
  data: DisplayInterface,
  errors: object,
  nextStepEvent: EventEmitter<NextStepEventData>,
  prevStepEvent: EventEmitter<PrevStepEventData>,
}
