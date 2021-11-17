import { TestBed } from '@angular/core/testing';
import { KEY_SHOW_LOG, LoggerService } from './logger.service';
import * as AngularCoreModule from '@angular/core';

describe('LoggerService', () => {
  let service: LoggerService;
  let message;
  const groupName = 'some group';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggerService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(LoggerService);
  });

  beforeEach(() => {
    message = ['some log', 'some log 2'];
    jest.spyOn(console, 'error');
    jest.spyOn(console, 'log');
    jest.spyOn(console, 'group');
    jest.spyOn(console, 'groupEnd');
  });

  describe('log()', () => {
    it('should do nothing if isDevMode is false AND localStorage SHOW_LOG property is not empty', () => {
      const isDevModeFn = jest.spyOn<any, string>(AngularCoreModule, 'isDevMode');
      const spy = jest.spyOn(console, 'log');

      isDevModeFn.mockReturnValue(false);
      service.log(message, groupName);
      // не вызывается, т.к. isDevMode false и в localStorage нет SHOW_LOG
      expect(console.log).not.toBeCalled();

      isDevModeFn.mockReturnValue(true);
      service.log(message, groupName);
      // вызывается, т.к. isDevMode true
      expect(console.log).toBeCalled();

      isDevModeFn.mockReturnValue(false);
      localStorage.setItem('SHOW_LOG', '1');
      service.log(message, groupName);
      // вызывается, т.к. SHOW_LOG не пустой
      expect(console.log).toBeCalled();
    });

    it('should call isShowLog', () => {
      const spy = jest.spyOn<any, string>(service, 'isShowLog');
      service.log(message, groupName);
      expect(spy).toBeCalled();
    });

    it('should call openGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'openGroup');
      service.log(message, groupName);
      expect(spy).toBeCalled();
    });

    it('should call closeGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'closeGroup');
      service.log(message, groupName);
      expect(spy).toBeCalled();
    });

    it('shouldn\'t call openGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'openGroup');
      service.log(message);
      expect(spy).not.toBeCalled();
    });

    it('shouldn\'t call closeGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'closeGroup');
      service.log(message);
      expect(spy).not.toBeCalled();
    });

    it('should call once showMessage', () => {
      const spy = jest.spyOn<any, string>(service, 'showMessage');
      service.log(['another log'], groupName);
      expect(spy).toBeCalledTimes(1);
    });

    it('should call twice showMessage', () => {
      const spy = jest.spyOn<any, string>(service, 'showMessage');
      service.log(message, groupName);
      expect(spy).toBeCalledTimes(2);
    });
  });

  describe('error()', () => {
    it('shouldn\'t call isShowLog', () => {
      const spy = jest.spyOn<any, string>(service, 'isShowLog');
      service.error(message, groupName);
      expect(spy).not.toBeCalled();
    });

    it('should call openGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'openGroup');
      service.error(message, groupName);
      expect(spy).toBeCalled();
    });

    it('should call closeGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'closeGroup');
      service.error(message, groupName);
      expect(spy).toBeCalled();
    });

    it('shouldn\'t call openGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'openGroup');
      service.error(message);
      expect(spy).not.toBeCalled();
    });

    it('shouldn\'t call closeGroup', () => {
      const spy = jest.spyOn<any, string>(service, 'closeGroup');
      service.error(message);
      expect(spy).not.toBeCalled();
    });

    it('should call once showError', () => {
      const spy = jest.spyOn<any, string>(service, 'showError');
      service.error(['another log'], groupName);
      expect(spy).toBeCalledTimes(1);
    });

    it('should call twice showError', () => {
      const spy = jest.spyOn<any, string>(service, 'showError');
      service.error(message, groupName);
      expect(spy).toBeCalledTimes(2);
    });
  });

  describe('isShowLog()', () => {
    it('should call isDevMode', () => {
      const spy = jest.spyOn<any, string>(AngularCoreModule, 'isDevMode');
      service['isShowLog']();
      expect(spy).toBeCalled();
    });

    it('should return true when isDevMode', () => {
      jest.spyOn<any, string>(AngularCoreModule, 'isDevMode').mockReturnValue(true);
      const isShowLog = service['isShowLog']();
      expect(isShowLog).toBeTruthy();
    });

    it('should return true when lib not in isDevMode and localStorage has KEY_SHOW_LOG item', () => {
      jest.spyOn<any, string>(AngularCoreModule, 'isDevMode').mockReturnValue(false);
      localStorage.setItem(KEY_SHOW_LOG, '{}');
      const isShowLog = service['isShowLog']();
      expect(isShowLog).toBeTruthy();
      localStorage.removeItem(KEY_SHOW_LOG);
    });

    it('should return false when lib not in isDevMode and localStorage hasn\'t KEY_SHOW_LOG item', () => {
      jest.spyOn<any, string>(AngularCoreModule, 'isDevMode').mockReturnValue(false);
      const isShowLog = service['isShowLog']();
      expect(isShowLog).toBeFalsy();
    });
  });

  describe('showMessage()', () => {
    it('should call console.log', () => {
      service['showMessage'](message[0]);
      expect(console.log).toBeCalledWith(message[0]);
    });
  });

  describe('openGroup()', () => {
    it('should call console.group', () => {
      service['openGroup'](groupName);
      expect(console.group).toBeCalledWith(groupName);
    });
  });

  describe('closeGroup()', () => {
    it('should call console.groupEnd', () => {
      service['closeGroup']();
      expect(console.groupEnd).toBeCalled();
    });
  });

  describe('showError()', () => {
    it('should call console.error', () => {
      service['showError'](message[0]);
      expect(console.error).toBeCalledWith(message[0]);
    });
  });
});
