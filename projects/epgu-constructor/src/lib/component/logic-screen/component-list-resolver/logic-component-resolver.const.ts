import { Type } from '@angular/core';
import { LogicScreenComponentTypes } from './logic-screen-component-types';
import RestCallComponent from '../components/rest-call/rest-call.component';
import ValueCalculatorComponent from '../components/value-calculator/value-calculator.component';

export type ComponentTypes = LogicScreenComponentTypes;

export type LogicScreenComponent =
  RestCallComponent |
  ValueCalculatorComponent;

export type ScreenComponentTypes = LogicScreenComponent;

export const LOGIC_SCREEN_COMPONENTS: Partial<Record<
  LogicScreenComponentTypes,
  Type<LogicScreenComponent>
>> = {
  RestCall: RestCallComponent,
  ValueCalculator: ValueCalculatorComponent,

};
