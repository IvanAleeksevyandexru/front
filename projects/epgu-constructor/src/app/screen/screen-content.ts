import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { ScreenStore, ScreenTypes, ServiceInfo } from './screen.types';
import { concatMap, map } from 'rxjs/operators';
import { ISuggestionItem } from '../core/services/autocomplete/autocomplete.inteface';
import {
  DisplayDto,
  DisplaySubjHead,
  Gender,
  ComponentDto,
  ScenarioErrorsDto,
  ScreenButton,
  ComponentAnswerDto,
  ComponentActionDto,
  ApplicantAnswersDto,
  CachedAnswersDto,
  LogicComponents
} from 'epgu-constructor-types';

type ComponentValueGeneric<T> = T;
export type ComponentValue = string | number | ComponentValueGeneric<unknown>;

export class ScreenContent {
  private _display = new BehaviorSubject<DisplayDto>(null);
  private _suggestions = new BehaviorSubject<{ [key: string]: ISuggestionItem }>({});
  private _header = new BehaviorSubject<string>(null);
  private _serviceCode = new BehaviorSubject<string>(null);
  private _subHeader = new BehaviorSubject<DisplaySubjHead>(null);
  private _submitLabel = new BehaviorSubject<string>(null);
  private _gender = new BehaviorSubject<Gender>(null);
  private _terminal = new BehaviorSubject<boolean>(null);
  private _showNav = new BehaviorSubject<boolean>(null);
  private _displayCssClass = new BehaviorSubject<string>(null);
  private _screenType = new BehaviorSubject<ScreenTypes>(null);
  private _orderId = new BehaviorSubject<number>(null);
  private _component = new BehaviorSubject<ComponentDto>(null);
  private _componentType = new BehaviorSubject<string>(null);
  private _componentValue = new BehaviorSubject<ComponentValue>(null);
  private _componentErrors = new BehaviorSubject<ScenarioErrorsDto>(null);
  private _componentError = new BehaviorSubject<string>(null);
  private _componentLabel = new BehaviorSubject<string>(null);
  private _buttons = new BehaviorSubject<Array<ScreenButton>>(null);
  private _button = new BehaviorSubject<ScreenButton>(null);
  private _actions = new BehaviorSubject<Array<ComponentActionDto>>(null);
  private _action = new BehaviorSubject<ComponentActionDto>(null);
  private _answers = new BehaviorSubject<Array<ComponentAnswerDto>>(null);
  private _applicantAnswers = new BehaviorSubject<ApplicantAnswersDto>(null);
  private _cachedAnswers = new BehaviorSubject<CachedAnswersDto>(null);
  private _logicComponents = new BehaviorSubject<LogicComponents[]>([]);
  private _logicAnswers = new BehaviorSubject<ApplicantAnswersDto>(null);
  private _serviceInfo = new BehaviorSubject<null | ServiceInfo>(null);
  private _isTheSameScreenWithErrors = new BehaviorSubject<boolean>(null);

  public get displayInfoComponents$(): Observable<[ComponentDto, ComponentValue][]> {
    return this.display$.pipe(
      concatMap(({ infoComponents, components }) =>
        infoComponents
          ? (of(infoComponents).pipe(
            map(
              (infoList) => this.filteredComponents(infoList, components)
              ),
            ) as Observable<[ComponentDto, ComponentValue][]>)
          : of([] as [ComponentDto, ComponentValue][]),
      ),
    );
  }

  public get componentInfoComponents$(): Observable<[ComponentDto, ComponentValue][]> {
    return this.component$.pipe(
      concatMap(({ attrs: { infoComponents }}) =>
        infoComponents
          ? (combineLatest([of(infoComponents), this.display$]).pipe(
              map(
                ([infoList, display]) => this.filteredComponents(infoList, display.components)
              ),
            ) as Observable<[ComponentDto, ComponentValue][]>)
          : (of([]) as Observable<[ComponentDto, ComponentValue][]>),
      ),
    );
  }

  public get display(): DisplayDto {
    return this._display.getValue();
  }
  public set display(val: DisplayDto) {
    this._display.next(val);
  }
  public get display$(): Observable<DisplayDto> {
    return this._display.asObservable();
  }

  public get isTheSameScreenWithErrors(): boolean {
    return this._isTheSameScreenWithErrors.getValue();
  }
  public set isTheSameScreenWithErrors(val: boolean) {
    this._isTheSameScreenWithErrors.next(val);
  }
  public get isTheSameScreenWithErrors$(): Observable<boolean> {
    return this._isTheSameScreenWithErrors.asObservable();
  }

  public get suggestions(): { [key: string]: ISuggestionItem } {
    return this._suggestions.getValue();
  }
  public set suggestions(val: { [key: string]: ISuggestionItem }) {
    this._suggestions.next(val);
  }
  public get suggestions$(): Observable<{ [key: string]: ISuggestionItem }> {
    return this._suggestions.asObservable();
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

  public get serviceCode(): string {
    return this._serviceCode.getValue();
  }
  public set serviceCode(val: string) {
    this._serviceCode.next(val);
  }
  public get serviceCode$(): Observable<string> {
    return this._serviceCode.asObservable();
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

  public get orderId(): number {
    return this._orderId.getValue();
  }
  public set orderId(val: number) {
    this._orderId.next(val);
  }
  public get orderId$(): Observable<number> {
    return this._orderId.asObservable();
  }
  public get orderIdAsString$(): Observable<string> {
    return this._orderId.asObservable().pipe(map(id => id.toString()));
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
  public set componentValue(val: ComponentValue) {
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

  public get buttons(): Array<ScreenButton> {
    return this._buttons.getValue();
  }
  public set buttons(val: Array<ScreenButton>) {
    this._buttons.next(val);
  }
  public get buttons$(): Observable<ScreenButton[]> {
    return this._buttons.asObservable();
  }

  public get button(): ScreenButton {
    return this._button.getValue();
  }
  public set button(val: ScreenButton) {
    this._button.next(val);
  }
  public get button$(): Observable<ScreenButton> {
    return this._button.asObservable();
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
    const applicantAnswers = this.applicantAnswers;
    this._cachedAnswers.next({ ...applicantAnswers, ...val });
  }

  public get cachedAnswers$(): Observable<CachedAnswersDto> {
    return this._cachedAnswers.asObservable();
  }

  public get logicComponents(): LogicComponents[] {
    return this._logicComponents.getValue();
  }
  public set logicComponents(val: LogicComponents[]) {
    this._logicComponents.next(val);
  }

  public get logicAnswers$(): Observable<ApplicantAnswersDto> {
    return this._logicAnswers.asObservable();
  }

  public get logicAnswers(): ApplicantAnswersDto {
    return this._logicAnswers.getValue();
  }
  public set logicAnswers(val: ApplicantAnswersDto) {
    this._logicAnswers.next(val);
  }

  public get logicComponents$(): Observable<LogicComponents[]> {
    return this._logicComponents.asObservable();
  }

  public get serviceInfo(): ServiceInfo {
    return this._serviceInfo.getValue();
  }
  public set serviceInfo(val: ServiceInfo) {
    this._serviceInfo.next(val);
  }

  public get serviceInfo$(): Observable<ServiceInfo> {
    return this._serviceInfo.asObservable();
  }

  public updateScreenContent(screenStore: ScreenStore, isWebView: boolean): void {
    const {
      errors = {} as ScenarioErrorsDto,
      display = {} as DisplayDto,
      orderId,
      gender,
      applicantAnswers,
      cachedAnswers,
      serviceCode,
      logicComponents = [],
      serviceInfo = {},
    } = screenStore;
    const {
      header,
      subHeader,
      submitLabel,
      type,
      components = [],
      terminal,
      cssClass,
      buttons,
      firstScreen,
      hideBackButton,
    } = display;
    const firstComponent = components.filter((component) => component?.attrs?.hidden !== true)[0];
    this.isTheSameScreenWithErrors = this.display?.id === display?.id && errors && Object.keys(errors).length !== 0;
    this.screenType = type;
    this.display = display;
    this.header = header;
    this.subHeader = subHeader;
    this.submitLabel = submitLabel;
    this.gender = gender;
    this.terminal = terminal;
    this.showNav = (!terminal && !(isWebView && firstScreen)) && (terminal ? false : !hideBackButton);
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
    this.button = this.buttons[0];
    this.answers = firstComponent?.attrs?.answers || [];
    this.applicantAnswers = applicantAnswers;
    this.cachedAnswers = cachedAnswers;
    this.serviceCode = serviceCode;
    this.logicComponents = logicComponents;
    this.serviceInfo = serviceInfo;
  }

  public getComponentData(str: string): ComponentValue {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }

  private filteredComponents(infoList, components): [ComponentDto, ComponentValue][] {
    return infoList
      .map((componentId) => {
        const findedComponent = components.find(
          (component) => component.id === componentId
        );
        return findedComponent
          ? [findedComponent, this.getComponentData(findedComponent.value)]
          : null;
      })
      .filter((component) => !!component);
}
}
