import { Injectable } from '@angular/core';
import { Service } from '../../form-player.types';

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

  init(service: Service) {
    this._serviceId = service.serviceId;
    this._orderId = service.orderId;
    this._targetId = service.targetId;
  }
}
