import { Injectable } from '@angular/core';
import { FormPlayerContext, QueryParams, ServiceEntity } from '../../../form-player/form-player.types';

@Injectable()
export class InitDataServiceStub implements ServiceEntity, FormPlayerContext {
  private _serviceId: string;
  private _orderId: number;
  private _targetId: string;
  private _invited: boolean;
  private _canStartNew: boolean;
  private _initState: string;
  private _configId: string;
  private _queryParams: QueryParams;
  private _gepsId: string;

  get serviceId(): string {
    return this._serviceId;
  }

  set serviceId(serviceId: string) {
    this._serviceId = serviceId;
  }

  get targetId(): string {
    return this._targetId;
  }

  set targetId(targetId: string) {
    this._targetId = targetId;
  }

  get orderId(): number {
    return this._orderId;
  }

  set orderId(orderId: number) {
    this._orderId = orderId;
  }

  get invited(): boolean {
    return this._invited;
  }

  set invited(invited: boolean) {
    this._invited = invited;
  }

  get initState(): string {
    return this._initState;
  }

  set initState(initState: string) {
    this._initState = initState;
  }

  get canStartNew(): boolean {
    return this._canStartNew;
  }

  set canStartNew(canStartNew: boolean) {
    this._canStartNew = canStartNew  ?? true;
  }

  get configId(): string {
    return this._configId;
  }

  set configId(configId: string) {
    this._configId = configId;
  }

  get queryParams(): QueryParams {
    return this._queryParams;
  }

  set queryParams(queryParams: QueryParams) {
    this._queryParams = queryParams;
  }

  get gepsId(): string {
    return this._gepsId;
  }

  set gepsId(gepsId: string) {
    this._gepsId = gepsId;
  }

  init(service: ServiceEntity, context?: FormPlayerContext): void {
    this.serviceId = service.serviceId;
    this.targetId = service.targetId;
    this.orderId = service.orderId;
    this.invited = service.invited;
    this.canStartNew = service.canStartNew;
    this.initState = context?.initState;
    this.configId = context?.configId;
    this.gepsId = context?.gepsId;
    this.queryParams = context?.queryParams;
  }
}
