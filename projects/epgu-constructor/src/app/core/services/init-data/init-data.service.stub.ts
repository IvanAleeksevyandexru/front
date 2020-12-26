import { Injectable } from '@angular/core';
import { FormPlayerContext, InitData } from '../../../form-player/form-player.types';

@Injectable()
export class InitDataServiceStub implements InitData {
  private _serviceId: string;
  private _orderId: string;
  private _targetId: string;
  private _invited: boolean;
  private _canStartNew: boolean;
  private _initState: string;
  private _context: FormPlayerContext;

  get serviceId(): string {
    return this._serviceId;
  }

  get targetId(): string {
    return this._targetId;
  }

  get orderId(): string {
    return this._orderId;
  }

  set orderId(orderId: string) {
    this._orderId = orderId;
  }

  get invited(): boolean {
    return this._invited;
  }

  get initState(): string {
    return this._initState;
  }

  set invited(invited: boolean) {
    this._invited = invited;
  }

  get canStartNew(): boolean {
    return this._canStartNew;
  }

  set canStartNew(canStartNew: boolean) {
    this._canStartNew = canStartNew;
  }

  get context(): FormPlayerContext {
    return this._context;
  }

  set context(context: FormPlayerContext) {
    this._context = context;
  }

  init(data: InitData): void {
    this._serviceId = data.serviceId;
    this._targetId = data.targetId;
    this._initState = data.initState;
    this.orderId = data.orderId;
    this.invited = data.invited;
    this.canStartNew = data.canStartNew;
    this.context = data.context;
  }
}
