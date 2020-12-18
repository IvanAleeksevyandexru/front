import { BehaviorSubject, Observable } from 'rxjs';
import {
  ApplicantAnswersDto,
  CachedAnswersDto,
  ComponentActionDto,
  ComponentAnswerDto,
  ComponentDto,
  DisplayDto,
  DisplaySubjHead,
  ScenarioErrorsDto,
  ScreenActionDto
} from '../form-player/services/form-player-api/form-player-api.types';
import { Gender } from '../shared/types/gender';
import { ScreenStore, ScreenTypes } from './screen.types';

type ComponentValueGeneric<T> = T;
type ComponentValue = string | number | ComponentValueGeneric<unknown>;

export class ScreenContent {
  public get display(): DisplayDto {
    return this._display.getValue();
  }
  public set display(val: DisplayDto) {
    this._display.next(val);
  }
  public get display$(): Observable<DisplayDto> {
    return this._display.asObservable();
  }

  public get header(): string {
    return this._header.getValue();
  }
  public set header(val: string) {
    this._header.next(val);
  }
  public get header$(): Observable<string> {
    return this._header.asObservable();
  }

  public get subHeader(): DisplaySubjHead {
    return this._subHeader.getValue();
  }
  public set subHeader(val: DisplaySubjHead) {
    this._subHeader.next(val);
  }
  public get subHeader$(): Observable<DisplaySubjHead> {
    return this._subHeader.asObservable();
  }

  public get submitLabel(): string {
    return this._submitLabel.getValue();
  }
  public set submitLabel(val: string) {
    this._submitLabel.next(val);
  }
  public get submitLabel$(): Observable<string> {
    return this._submitLabel.asObservable();
  }

  public get gender(): Gender {
    return this._gender.getValue();
  }
  public set gender(val: Gender) {
    this._gender.next(val);
  }
  public get gender$(): Observable<Gender> {
    return this._gender.asObservable();
  }

  public get terminal(): boolean {
    return this._terminal.getValue();
  }
  public set terminal(val: boolean) {
    this._terminal.next(val);
  }
  public get terminal$(): Observable<boolean> {
    return this._terminal.asObservable();
  }

  public get showNav(): boolean {
    return this._showNav.getValue();
  }
  public set showNav(val: boolean) {
    this._showNav.next(val);
  }
  public get showNav$(): Observable<boolean> {
    return this._showNav.asObservable();
  }

  public get displayCssClass(): string {
    return this._displayCssClass.getValue();
  }
  public set displayCssClass(val: string) {
    this._displayCssClass.next(val);
  }
  public get displayCssClass$(): Observable<string> {
    return this._displayCssClass.asObservable();
  }

  public get screenType(): ScreenTypes {
    return this._screenType.getValue();
  }
  public set screenType(val: ScreenTypes) {
    this._screenType.next(val);
  }
  public get screenType$(): Observable<ScreenTypes> {
    return this._screenType.asObservable();
  }

  public get orderId(): string {
    return this._orderId.getValue();
  }
  public set orderId(val: string) {
    this._orderId.next(val);
  }
  public get orderId$(): Observable<string> {
    return this._orderId.asObservable();
  }

  public get component(): ComponentDto {
    return this._component.getValue();
  }
  public set component(val: ComponentDto) {
    this._component.next(val);
  }
  public get component$(): Observable<ComponentDto> {
    return this._component.asObservable();
  }

  public get componentType(): string {
    return this._componentType.getValue();
  }
  public set componentType(val: string) {
    this._componentType.next(val);
  }
  public get componentType$(): Observable<string> {
    return this._componentType.asObservable();
  }

  public get componentValue(): ComponentValue {
    return this._componentValue.getValue();
  }
  public set componentValue(val: ComponentValue ) {
    this._componentValue.next(val);
  }
  public get componentValue$(): Observable<ComponentValue> {
    return this._componentValue.asObservable();
  }

  public get componentErrors(): ScenarioErrorsDto {
    return this._componentErrors.getValue();
  }
  public set componentErrors(val: ScenarioErrorsDto) {
    this._componentErrors.next(val);
  }
  public get componentErrors$(): Observable<ScenarioErrorsDto> {
    return this._componentErrors.asObservable();
  }

  public get componentError(): string {
    return this._componentError.getValue();
  }
  public set componentError(val: string) {
    this._componentError.next(val);
  }
  public get componentError$(): Observable<string> {
    return this._componentError.asObservable();
  }

  public get componentLabel(): string {
    return this._componentLabel.getValue();
  }
  public set componentLabel(val: string) {
    this._componentLabel.next(val);
  }
  public get componentLabel$(): Observable<string> {
    return this._componentLabel.asObservable();
  }

  public get buttons(): Array<ScreenActionDto> {
    return this._buttons.getValue();
  }
  public set buttons(val: Array<ScreenActionDto>) {
    this._buttons.next(val);
  }
  public get buttons$(): Observable<ScreenActionDto[]> {
    return this._buttons.asObservable();
  }

  public get actions(): Array<ComponentActionDto> {
    return this._actions.getValue();
  }
  public set actions(val: Array<ComponentActionDto>) {
    this._actions.next(val);
  }
  public get actions$(): Observable<ComponentActionDto[]> {
    return this._actions.asObservable();
  }

  public get action(): ComponentActionDto {
    return this._action.getValue();
  }
  public set action(val: ComponentActionDto) {
    this._action.next(val);
  }
  public get action$(): Observable<ComponentActionDto> {
    return this._action.asObservable();
  }

  public get answers(): Array<ComponentAnswerDto> {
    return this._answers.getValue();
  }
  public set answers(val: Array<ComponentAnswerDto>) {
    this._answers.next(val);
  }
  public get answers$(): Observable<ComponentAnswerDto[]> {
    return this._answers.asObservable();
  }

  public get applicantAnswers(): ApplicantAnswersDto {
    return this._applicantAnswers.getValue();
  }
  public set applicantAnswers(val: ApplicantAnswersDto) {
    this._applicantAnswers.next(val);
  }
  public get applicantAnswers$(): Observable<ApplicantAnswersDto> {
    return this._applicantAnswers.asObservable();
  }

  public get cachedAnswers(): CachedAnswersDto {
    return this._cachedAnswers.getValue();
  }
  public set cachedAnswers(val: CachedAnswersDto) {
    this._cachedAnswers.next(val);
  }

  public get cachedAnswers$(): Observable<CachedAnswersDto> {
    return this._cachedAnswers.asObservable();
  }

  private _display = new BehaviorSubject<DisplayDto>(null);
  private _header = new BehaviorSubject<string>(null);
  private _subHeader = new BehaviorSubject<DisplaySubjHead>(null);
  private _submitLabel = new BehaviorSubject<string>(null);
  private _gender = new BehaviorSubject<Gender>(null);
  private _terminal = new BehaviorSubject<boolean>(null);
  private _showNav = new BehaviorSubject<boolean>(null);
  private _displayCssClass = new BehaviorSubject<string>(null);
  private _screenType = new BehaviorSubject<ScreenTypes>(null);
  private _orderId = new BehaviorSubject<string>(null);
  private _component = new BehaviorSubject<ComponentDto>(null);
  private _componentType = new BehaviorSubject<string>(null);
  private _componentValue = new BehaviorSubject<ComponentValue>(null);
  private _componentErrors = new BehaviorSubject<ScenarioErrorsDto>(null);
  private _componentError = new BehaviorSubject<string>(null);
  private _componentLabel = new BehaviorSubject<string>(null);
  private _buttons = new BehaviorSubject<Array<ScreenActionDto>>(null);
  private _actions = new BehaviorSubject<Array<ComponentActionDto>>(null);
  private _action = new BehaviorSubject<ComponentActionDto>(null);
  private _answers = new BehaviorSubject<Array<ComponentAnswerDto>>(null);
  private _applicantAnswers = new BehaviorSubject<ApplicantAnswersDto>(null);
  private _cachedAnswers = new BehaviorSubject<CachedAnswersDto>(null);

  updateScreenContent(screenStore: ScreenStore): void {
    const {
      errors = {} as ScenarioErrorsDto,
      display = {} as DisplayDto,
      orderId,
      gender,
      applicantAnswers,
      cachedAnswers
    } = screenStore;
    const { header, subHeader, submitLabel, type, components = [], terminal, cssClass, buttons } = display;
    const firstComponent = components[0];
    this.display = display;
    this.header = header;
    this.subHeader = subHeader;
    this.submitLabel = submitLabel;
    this.screenType = type;
    this.gender = gender;
    this.terminal = terminal;
    this.showNav = !terminal;
    this.displayCssClass = cssClass;
    this.orderId = orderId;
    this.componentErrors = errors;
    this.componentError = errors[firstComponent?.id];
    this.component = firstComponent;
    this.componentType = firstComponent?.type;
    this.componentLabel = firstComponent?.label;
    this.componentValue = this.getComponentData(firstComponent?.value);
    this.actions = firstComponent?.attrs?.actions || [];
    this.buttons = buttons || [];
    this.action = this.actions[0];
    this.answers = firstComponent?.attrs?.answers || [];
    this.applicantAnswers = applicantAnswers;
    this.cachedAnswers = cachedAnswers;
  }

  getComponentData(str: string): ComponentValue {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
}
