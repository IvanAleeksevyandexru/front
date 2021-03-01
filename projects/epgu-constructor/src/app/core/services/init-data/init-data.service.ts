import { Injectable } from '@angular/core';
import { FormPlayerContext, QueryParams, ServiceEntity, ServiceInfo } from '../../../form-player/form-player.types';
import { LoggerService } from '../logger/logger.service';

/**
 * Сервис необходим для хранения входных параметров с которыми стартует приложение
 */
@Injectable()
export class InitDataService implements ServiceEntity, FormPlayerContext {
  private _serviceId: string;
  private _orderId: string;
  private _targetId: string;
  private _serviceInfo: ServiceInfo;
  private _invited: boolean;
  private _canStartNew: boolean;
  private _initState: string;
  private _configId: string;
  private _queryParams: QueryParams;

  constructor(private loggerService: LoggerService) { }

  init(service: ServiceEntity, context?: FormPlayerContext): void {
    this.checkProps(service);
    this.serviceId = service.serviceId;
    this.targetId = service.targetId;
    this.serviceInfo = service.serviceInfo;
    this.orderId = service.orderId;
    this.invited = service.invited;
    this.canStartNew = service.canStartNew;
    this.initState = context?.initState;
    this.configId = context?.configId;
    this.queryParams = context?.queryParams;
  }

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

  get serviceInfo(): ServiceInfo {
    return this._serviceInfo;
  }

  set serviceInfo(serviceInfo: ServiceInfo) {
    this._serviceInfo = serviceInfo;
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

  private checkProps(service: ServiceEntity): void {
    this.loggerService.log([service], '----- Init props ---------');

    if (!service) {
      throw Error('Need to set Service for epgu form player');
    }

    const { invited, orderId } = service;
    if (invited && !orderId) {
      throw Error('Should set orderId when invited');
    }
  }
}
