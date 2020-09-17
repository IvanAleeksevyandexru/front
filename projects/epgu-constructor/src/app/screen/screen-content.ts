import { ComponentDto, DisplayDto } from '../services/api/form-player-api/form-player-api.types';
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
  private display$ = this._display.asObservable();

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

  constructor() {}

  updateScreenContent(screenStore: ScreenStore) {
    const { display = {} as any, orderId } = screenStore;
    const { header, submitLabel, type, components = [] } = display;
    this.display = display;
    this.header = header;
    this.submitLabel = submitLabel;
    this.screenType = type;
    this.component = components[0];
    this.componentType = components[0]?.type;
    this.orderId = orderId;
  }
}
