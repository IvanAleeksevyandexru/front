import {
  ApplicantAnswersDto,
  ComponentDto,
  ComponentDtoAction, CurrentCycledFieldsDto,
  DisplayDto,
  ScenarioErrorsDto
} from '../services/api/form-player-api/form-player-api.types';
import { ScreenStore, ScreenTypes } from './screen.types';
import { BehaviorSubject } from 'rxjs';
import { Gender } from '../shared/types/gender';

export class ScreenContent {

  private _display = new BehaviorSubject<DisplayDto>(null);
  public get display() {
    return this._display.getValue();
  }
  public set display(val: DisplayDto) {
    this._display.next(val);
  }
  public display$ = this._display.asObservable();

  private _header = new BehaviorSubject<string>(null);
  public get header() {
    return this._header.getValue();
  }
  public set header(val: string) {
    this._header.next(val);
  }
  public header$ = this._header.asObservable();

  private _submitLabel = new BehaviorSubject<string>(null);
  public get submitLabel() {
    return this._submitLabel.getValue();
  }
  public set submitLabel(val: string) {
    this._submitLabel.next(val);
  }
  public submitLabel$ = this._submitLabel.asObservable();

  private _gender = new BehaviorSubject<Gender>(null);
  public get gender() {
    return this._gender.getValue();
  }
  public set gender(val: Gender) {
    this._gender.next(val);
  }
  public gender$ = this._gender.asObservable();

  private _terminal = new BehaviorSubject<boolean>(null);
  public get terminal() {
    return this._terminal.getValue();
  }
  public set terminal(val: boolean) {
    this._terminal.next(val);
  }
  public terminal$ = this._terminal.asObservable();

  private _screenType = new BehaviorSubject<ScreenTypes>(null);
  public get screenType() {
    return this._screenType.getValue();
  }
  public set screenType(val: ScreenTypes) {
    this._screenType.next(val);
  }
  public screenType$ = this._screenType.asObservable();

  private _orderId = new BehaviorSubject<string>(null);
  public get orderId() {
    return this._orderId.getValue();
  }
  public set orderId(val: string) {
    this._orderId.next(val);
  }
  public orderId$ = this._orderId.asObservable();

  private _component = new BehaviorSubject<ComponentDto>(null);
  public get component() {
    return this._component.getValue();
  }
  public set component(val: ComponentDto) {
    this._component.next(val);
  }
  public component$ = this._component.asObservable();

  private _componentType = new BehaviorSubject<string>(null);
  public get componentType() {
    return this._componentType.getValue();
  }
  public set componentType(val: string) {
    this._componentType.next(val);
  }
  public componentType$ = this._componentType.asObservable();

  private _componentValue = new BehaviorSubject<{[key: string]: any} | string>(null);
  public get componentValue() {
    return this._componentValue.getValue();
  }
  public set componentValue(val: {[key: string]: any} | string ) {
    this._componentValue.next(val);
  }
  public componentValue$ = this._componentType.asObservable();

  private _componentErrors = new BehaviorSubject<ScenarioErrorsDto>(null);
  public get componentErrors() {
    return this._componentErrors.getValue();
  }
  public set componentErrors(val: ScenarioErrorsDto) {
    this._componentErrors.next(val);
  }
  public componentErrors$ = this._componentErrors.asObservable();

  private _componentError = new BehaviorSubject<string>(null);
  public get componentError() {
    return this._componentError.getValue();
  }
  public set componentError(val: string) {
    this._componentError.next(val);
  }
  public componentError$ = this._componentError.asObservable();

  private _componentLabel = new BehaviorSubject<string>(null);
  public get componentLabel() {
    return this._componentLabel.getValue();
  }
  public set componentLabel(val: string) {
    this._componentLabel.next(val);
  }
  public componentLabel$ = this._componentLabel.asObservable();

  private _actions = new BehaviorSubject<Array<ComponentDtoAction>>(null);
  public get actions() {
    return this._actions.getValue();
  }
  public set actions(val: Array<ComponentDtoAction>) {
    this._actions.next(val);
  }
  public actions$ = this._actions.asObservable();

  private _currentCycledFields = new BehaviorSubject<CurrentCycledFieldsDto>(null);
  public get currentCycledFields(): CurrentCycledFieldsDto {
    return this._currentCycledFields.getValue();
  }
  public set currentCycledFields(val: CurrentCycledFieldsDto) {
    this._currentCycledFields.next(val);
  }
  public currentCycledFields$ = this._currentCycledFields.asObservable();

  private _applicantAnswers = new BehaviorSubject<ApplicantAnswersDto>(null);
  public get applicantAnswers(): ApplicantAnswersDto {
    return this._applicantAnswers.getValue();
  }
  public set applicantAnswers(val: ApplicantAnswersDto) {
    this._applicantAnswers.next(val);
  }
  public applicantAnswers$ = this._applicantAnswers.asObservable();

  updateScreenContent(screenStore: ScreenStore) {
    const { display = {} as any, orderId, gender, errors = {} as any, currentCycledFields, applicantAnswers } = screenStore;
    const { header, submitLabel, type, components = [], terminal } = display;
    const firstComponent = components[0];
    this.display = display;
    this.header = header;
    this.submitLabel = submitLabel;
    this.screenType = type;
    this.gender = gender;
    this.terminal = terminal;
    this.orderId = orderId;
    this.componentErrors = errors;
    this.componentError = errors[firstComponent?.id];
    this.component = firstComponent;
    this.componentType = firstComponent?.type;
    this.componentLabel = firstComponent?.label;
    this.componentValue = this.getComponentData(firstComponent?.value);
    this.actions = firstComponent?.attrs?.actions || [];
    this.currentCycledFields = currentCycledFields;
    this.applicantAnswers = applicantAnswers;
  }

  getComponentData(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
}
