import { Injectable } from '@angular/core';
import { Service } from '../../form-player.types';

@Injectable()
export class ServiceDataServiceStub implements Service {
  private _serviceId: string;
  private _orderId: string;
  private _targetId: string;
  private _invited: boolean;
  private _canStartNew: boolean;
  private _initState: string;

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

  init(service: Service): void {
    this._serviceId = service.serviceId;
    this._targetId = service.targetId;
    this._initState = service.initState;
    this.orderId = service.orderId;
    this.invited = service.invited;
    this.canStartNew = service.canStartNew ?? true;
  }
}
