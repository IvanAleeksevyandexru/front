import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ServiceDataService {
  private _serviceId: string;
  private _orderId: string;
  private _targetId: string;

  get serviceId(): string {
    return this._serviceId;
  }

  get orderId(): string {
    return this._orderId;
  }

  get targetId(): string {
    return this._targetId;
  }

  constructor() {
  }

  init(serviceId: string, orderId: string, targetId: string) {
    this._serviceId = serviceId;
    this._orderId = orderId;
    this._targetId = targetId;
  }
}
