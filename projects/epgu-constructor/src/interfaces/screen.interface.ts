import { DisplayInterface, Gender } from './epgu.service.interface';
import { EventEmitter } from '@angular/core';
import { NextStepEventData, PrevStepEventData } from './step-event-data.interface';

export interface ScreenData {
  componentData: DisplayInterface,
  errors: object,
  gender?: Gender,
}

export interface ScreenOutputs {
  nextStepEvent: EventEmitter<NextStepEventData>,
  prevStepEvent: EventEmitter<PrevStepEventData>,
}
