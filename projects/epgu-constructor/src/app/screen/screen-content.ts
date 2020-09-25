import {
  ComponentDto,
  ComponentDtoAction,
  DisplayDto,
  ScenarioErrorsDto
} from '../services/api/form-player-api/form-player-api.types';
import { ScreenStore, ScreenTypes } from './screen.types';
import { BehaviorSubject } from 'rxjs';

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

  private _screenType = new BehaviorSubject<ScreenTypes>(null);
  public get screenType() {
    return this._screenType.getValue();
  }
  public set screenType(val: ScreenTypes) {
    this._screenType.next(val);
  }
  public screenType$ = this._screenType.asObservable();

  private _orderId = new BehaviorSubject<number>(null);
  public get orderId() {
    return this._orderId.getValue();
  }
  public set orderId(val: number) {
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

  constructor() {}

  updateScreenContent(screenStore: ScreenStore) {
    const { display = {} as any, orderId, errors = {} as any } = screenStore;
    const { header, submitLabel, type, components = [] } = display;
    this.display = display;
    this.header = header;
    this.submitLabel = submitLabel;
    this.screenType = type;
    this.orderId = orderId;
    this.componentErrors = errors;
    this.componentError = errors[components[0]?.id];
    this.component = components[0];
    this.componentType = components[0]?.type;
    this.componentLabel = components[0]?.label;
    this.actions = components[0]?.attrs?.actions || [];
    this.componentValue = this.getComponentData(components[0]?.value);
  }

  getComponentData(str: string) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  }
}
