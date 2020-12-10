import {
  ApplicantAnswersDto,
  ComponentDto,
  ComponentActionDto,
  DisplayDto, DisplaySubjHead,
  ScenarioErrorsDto
} from '../form-player/services/form-player-api/form-player-api.types';
import { ScreenStore, ScreenTypes } from './screen.types';
import { BehaviorSubject } from 'rxjs';
import { Gender } from '../shared/types/gender';

type ComponentValueGeneric<T> =  T;
type ComponentValue = string | number | ComponentValueGeneric<unknown>;

export class ScreenContent {

  private _display = new BehaviorSubject<DisplayDto>(null);
  public get display(): DisplayDto {
    return this._display.getValue();
  }
  public set display(val: DisplayDto) {
    this._display.next(val);
  }
  public display$ = this._display.asObservable();

  private _header = new BehaviorSubject<string>(null);
  public get header(): string {
    return this._header.getValue();
  }
  public set header(val: string) {
    this._header.next(val);
  }
  public header$ = this._header.asObservable();

  private _subHeader = new BehaviorSubject<DisplaySubjHead>(null);
  public get subHeader(): DisplaySubjHead {
    return this._subHeader.getValue();
  }
  public set subHeader(val: DisplaySubjHead) {
    this._subHeader.next(val);
  }
  public subHeader$ = this._subHeader.asObservable();

  private _submitLabel = new BehaviorSubject<string>(null);
  public get submitLabel(): string {
    return this._submitLabel.getValue();
  }
  public set submitLabel(val: string) {
    this._submitLabel.next(val);
  }
  public submitLabel$ = this._submitLabel.asObservable();

  private _gender = new BehaviorSubject<Gender>(null);
  public get gender(): Gender {
    return this._gender.getValue();
  }
  public set gender(val: Gender) {
    this._gender.next(val);
  }
  public gender$ = this._gender.asObservable();

  private _terminal = new BehaviorSubject<boolean>(null);
  public get terminal(): boolean {
    return this._terminal.getValue();
  }
  public set terminal(val: boolean) {
    this._terminal.next(val);
  }
  public terminal$ = this._terminal.asObservable();

  private _displayCssClass = new BehaviorSubject<string>(null);
  public get displayCssClass(): string {
    return this._displayCssClass.getValue();
  }
  public set displayCssClass(val: string) {
    this._displayCssClass.next(val);
  }
  public displayCssClass$ = this._displayCssClass.asObservable();

  private _screenType = new BehaviorSubject<ScreenTypes>(null);
  public get screenType(): ScreenTypes {
    return this._screenType.getValue();
  }
  public set screenType(val: ScreenTypes) {
    this._screenType.next(val);
  }
  public screenType$ = this._screenType.asObservable();

  private _orderId = new BehaviorSubject<string>(null);
  public get orderId(): string {
    return this._orderId.getValue();
  }
  public set orderId(val: string) {
    this._orderId.next(val);
  }
  public orderId$ = this._orderId.asObservable();

  private _component = new BehaviorSubject<ComponentDto>(null);
  public get component(): ComponentDto {
    return this._component.getValue();
  }
  public set component(val: ComponentDto) {
    this._component.next(val);
  }
  public component$ = this._component.asObservable();

  private _componentType = new BehaviorSubject<string>(null);
  public get componentType(): string {
    return this._componentType.getValue();
  }
  public set componentType(val: string) {
    this._componentType.next(val);
  }
  public componentType$ = this._componentType.asObservable();

  private _componentValue = new BehaviorSubject<ComponentValue>(null);
  public get componentValue(): ComponentValue {
    return this._componentValue.getValue();
  }
  public set componentValue(val: ComponentValue ) {
    this._componentValue.next(val);
  }
  public componentValue$ = this._componentValue.asObservable();

  private _componentErrors = new BehaviorSubject<ScenarioErrorsDto>(null);
  public get componentErrors(): ScenarioErrorsDto {
    return this._componentErrors.getValue();
  }
  public set componentErrors(val: ScenarioErrorsDto) {
    this._componentErrors.next(val);
  }
  public componentErrors$ = this._componentErrors.asObservable();

  private _componentError = new BehaviorSubject<string>(null);
  public get componentError(): string {
    return this._componentError.getValue();
  }
  public set componentError(val: string) {
    this._componentError.next(val);
  }
  public componentError$ = this._componentError.asObservable();

  private _componentLabel = new BehaviorSubject<string>(null);
  public get componentLabel(): string {
    return this._componentLabel.getValue();
  }
  public set componentLabel(val: string) {
    this._componentLabel.next(val);
  }
  public componentLabel$ = this._componentLabel.asObservable();

  private _actions = new BehaviorSubject<Array<ComponentActionDto>>(null);
  public get actions(): Array<ComponentActionDto> {
    return this._actions.getValue();
  }
  public set actions(val: Array<ComponentActionDto>) {
    this._actions.next(val);
  }
  public actions$ = this._actions.asObservable();

  private _action = new BehaviorSubject<ComponentActionDto>(null);
  public get action(): ComponentActionDto {
    return this._action.getValue();
  }
  public set action(val: ComponentActionDto) {
    this._action.next(val);
  }
  public action$ = this._action.asObservable();

  private _applicantAnswers = new BehaviorSubject<ApplicantAnswersDto>(null);
  public get applicantAnswers(): ApplicantAnswersDto {
    return this._applicantAnswers.getValue();
  }
  public set applicantAnswers(val: ApplicantAnswersDto) {
    this._applicantAnswers.next(val);
  }
  public applicantAnswers$ = this._applicantAnswers.asObservable();

  updateScreenContent(screenStore: ScreenStore): void {
    const {
      errors = {} as ScenarioErrorsDto,
      display = {} as DisplayDto,
      orderId,
      gender,
      applicantAnswers
    } = screenStore;
    const { header, subHeader, submitLabel, type, components = [], terminal, cssClass } = display;
    const firstComponent = components[0];
    this.display = display;
    this.header = header;
    this.subHeader = subHeader;
    this.submitLabel = submitLabel;
    this.screenType = type;
    this.gender = gender;
    this.terminal = terminal;
    this.displayCssClass = cssClass;
    this.orderId = orderId;
    this.componentErrors = errors;
    this.componentError = errors[firstComponent?.id];
    this.component = firstComponent;
    this.componentType = firstComponent?.type;
    this.componentLabel = firstComponent?.label;
    this.componentValue = this.getComponentData(firstComponent?.value);
    this.actions = firstComponent?.attrs?.actions || [];
    this.action = this.actions[0];
    this.applicantAnswers = applicantAnswers;
  }

  getComponentData(str: string): ComponentValue {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
}
