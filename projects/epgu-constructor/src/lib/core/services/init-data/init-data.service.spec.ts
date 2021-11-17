import { TestBed } from '@angular/core/testing';
import { LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { LoggerServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { InitDataService } from './init-data.service';
import { FormPlayerContext, ServiceEntity } from '../../../form-player/form-player.types';

describe('InitDataService', () => {
  let service: InitDataService;
  let loggerService: LoggerService;
  let serviceEntity: ServiceEntity;
  let context: FormPlayerContext;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitDataService, { provide: LoggerService, useClass: LoggerServiceStub }],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(InitDataService);
    loggerService = TestBed.inject(LoggerService);
    serviceEntity = {
      serviceId: '10000100',
      targetId: '-10000100',
    };
    context = {};
  });

  describe('init()', () => {
    it('should call checkProps method', () => {
      const spy = jest.spyOn<any, string>(service, 'checkProps');
      service.init(serviceEntity, context);
      expect(spy).toBeCalledWith(serviceEntity, context);
    });

    it('should call set serviceId', () => {
      const setterSpy = jest.spyOn(service, 'serviceId', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(serviceEntity.serviceId);
    });

    it('should call set targetId', () => {
      const setterSpy = jest.spyOn(service, 'targetId', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(serviceEntity.targetId);
    });

    it('should call set serviceInfo', () => {
      const setterSpy = jest.spyOn(service, 'serviceInfo', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(serviceEntity.serviceInfo);
    });

    it('should call set orderId', () => {
      const setterSpy = jest.spyOn(service, 'orderId', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(serviceEntity.orderId);
    });

    it('should call set invited', () => {
      const setterSpy = jest.spyOn(service, 'invited', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(serviceEntity.invited);
    });

    it('should call set canStartNew', () => {
      const setterSpy = jest.spyOn(service, 'canStartNew', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(serviceEntity.canStartNew);
    });

    it('should call set initState', () => {
      const setterSpy = jest.spyOn(service, 'initState', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(context.initState);
    });

    it('should call set configId', () => {
      const setterSpy = jest.spyOn(service, 'configId', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(context.configId);
    });

    it('should call set queryParams', () => {
      const setterSpy = jest.spyOn(service, 'queryParams', 'set');
      service.init(serviceEntity, context);
      expect(setterSpy).toBeCalledWith(context.queryParams);
    });
  });

  describe('setters', () => {
    it('canStartNew should set true if set undefined', () => {
      jest.spyOn<any, string>(service, 'checkProps');
      service.canStartNew = undefined;
      expect(service['_canStartNew']).toBe(true);
    });

    it('canStartNew should set false if set false', () => {
      jest.spyOn<any, string>(service, 'checkProps');
      service.canStartNew = false;
      expect(service['_canStartNew']).toBe(false);
    });

    it('canStartNew should set true if set true', () => {
      jest.spyOn<any, string>(service, 'checkProps');
      service.canStartNew = true;
      expect(service['_canStartNew']).toBe(true);
    });
  });

  describe('getters', () => {
    it('serviceId', () => {
      const serviceId = '12345';
      service['_serviceId'] = serviceId;
      expect(service.serviceId).toBe(serviceId);
    });

    it('targetId', () => {
      const targetId = '-12345';
      service['_targetId'] = targetId;
      expect(service.targetId).toBe(targetId);
    });

    it('serviceInfo', () => {
      const serviceInfo = {
        stateOrg: { id: '', title: '' },
        routingCode: '',
        formPrefilling: false,
        infSysCode: '',
        error: '',
        userRegion: {
          name: '',
          path: '',
          codes: [],
        },
        queryParams: {},
      };
      service['_serviceInfo'] = serviceInfo;
      expect(service.serviceInfo).toBe(serviceInfo);
    });

    it('orderId', () => {
      const orderId = 12345;
      service['_orderId'] = orderId;
      expect(service.orderId).toBe(orderId);
    });

    it('gepsId', () => {
      const gepsId = 12345;
      service['_gepsId'] = gepsId;
      expect(service.gepsId).toBe(gepsId);
    });

    it('invited', () => {
      const invited = true;
      service['_invited'] = invited;
      expect(service.invited).toBe(invited);
    });

    it('initState', () => {
      const initState = '{}';
      service['_initState'] = initState;
      expect(service.initState).toBe(initState);
    });

    it('canStartNew', () => {
      const canStartNew = true;
      service['_canStartNew'] = canStartNew;
      expect(service.canStartNew).toBe(canStartNew);
    });

    it('configId', () => {
      const configId = 'default';
      service['_configId'] = configId;
      expect(service.configId).toBe(configId);
    });

    it('queryParams', () => {
      const queryParams = {};
      service['_queryParams'] = queryParams;
      expect(service.queryParams).toBe(queryParams);
    });
  });

  describe('checkProps()', () => {
    it('should call loggerService log', () => {
      const spy = jest.spyOn<any, string>(loggerService, 'log');
      service['checkProps'](serviceEntity);
      expect(spy).toBeCalled();
    });

    it('should throw error when empty error', () => {
      expect(() => service['checkProps'](null)).toThrow('Need to set Service for epgu form player');
    });

    it('should throw error when empty error', () => {
      serviceEntity = { ...serviceEntity, invited: true };
      expect(() => service['checkProps'](serviceEntity)).toThrow('Should set orderId when invited');
    });
  });
});
