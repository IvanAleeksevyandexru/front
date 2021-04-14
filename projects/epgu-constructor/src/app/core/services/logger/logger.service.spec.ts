import { TestBed } from '@angular/core/testing';
import { KEY_SHOW_LOG, LoggerService } from './logger.service';
import * as AngularCoreModule from '@angular/core';
import { configureTestSuite } from 'ng-bullet';

describe('LoggerService', () => {
  let service: LoggerService;
  let message;
  const groupName = 'some group';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        LoggerService,
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(LoggerService);
  });

  beforeEach(() => {
    message = ['some log', 'some log 2'];
    spyOn(console, 'error');
    spyOn(console, 'log');
    spyOn(console, 'group');
    spyOn(console, 'groupEnd');
  });

  describe('log()', () => {
    it('should call isShowLog', () => {
      spyOn<any>(service, 'isShowLog').and.callThrough();
      service.log(message, groupName);
      expect(service['isShowLog']).toBeCalled();
    });

    it('should call openGroup', () => {
      spyOn<any>(service, 'openGroup').and.callThrough();
      service.log(message, groupName);
      expect(service['openGroup']).toBeCalled();
    });

    it('should call closeGroup', () => {
      spyOn<any>(service, 'closeGroup').and.callThrough();
      service.log(message, groupName);
      expect(service['closeGroup']).toBeCalled();
    });

    it('shouldn\'t call openGroup', () => {
      spyOn<any>(service, 'openGroup').and.callThrough();
      service.log(message);
      expect(service['openGroup']).not.toBeCalled();
    });

    it('shouldn\'t call closeGroup', () => {
      spyOn<any>(service, 'closeGroup').and.callThrough();
      service.log(message);
      expect(service['closeGroup']).not.toBeCalled();
    });

    it('should call once showMessage', () => {
      spyOn<any>(service, 'showMessage').and.callThrough();
      service.log(['another log'], groupName);
      expect(service['showMessage']).toBeCalledTimes(1);
    });

    it('should call twice showMessage', () => {
      spyOn<any>(service, 'showMessage').and.callThrough();
      service.log(message, groupName);
      expect(service['showMessage']).toBeCalledTimes(2);
    });
  });

  describe('error()', () => {
    it('shouldn\'t call isShowLog', () => {
      spyOn<any>(service, 'isShowLog').and.callThrough();
      service.error(message, groupName);
      expect(service['isShowLog']).not.toBeCalled();
    });

    it('should call openGroup', () => {
      spyOn<any>(service, 'openGroup').and.callThrough();
      service.error(message, groupName);
      expect(service['openGroup']).toBeCalled();
    });

    it('should call closeGroup', () => {
      spyOn<any>(service, 'closeGroup').and.callThrough();
      service.error(message, groupName);
      expect(service['closeGroup']).toBeCalled();
    });

    it('shouldn\'t call openGroup', () => {
      spyOn<any>(service, 'openGroup').and.callThrough();
      service.error(message);
      expect(service['openGroup']).not.toBeCalled();
    });

    it('shouldn\'t call closeGroup', () => {
      spyOn<any>(service, 'closeGroup').and.callThrough();
      service.error(message);
      expect(service['closeGroup']).not.toBeCalled();
    });

    it('should call once showError', () => {
      spyOn<any>(service, 'showError').and.callThrough();
      service.error(['another log'], groupName);
      expect(service['showError']).toBeCalledTimes(1);
    });

    it('should call twice showError', () => {
      spyOn<any>(service, 'showError').and.callThrough();
      service.error(message, groupName);
      expect(service['showError']).toBeCalledTimes(2);
    });
  });

  describe('isShowLog()', () => {
    it('should call isDevMode', () => {
      spyOn<any>(AngularCoreModule, 'isDevMode').and.callThrough();
      service['isShowLog']();
      expect(AngularCoreModule['isDevMode']).toBeCalled();
    });

    it('should return true when isDevMode', () => {
      spyOn<any>(AngularCoreModule, 'isDevMode').and.returnValue(true);
      const isShowLog = service['isShowLog']();
      expect(isShowLog).toBeTruthy();
    });

    it('should return true when app not in isDevMode and localStorage has KEY_SHOW_LOG item', () => {
      spyOn<any>(AngularCoreModule, 'isDevMode').and.returnValue(false);
      localStorage.setItem(KEY_SHOW_LOG, '{}');
      const isShowLog = service['isShowLog']();
      expect(isShowLog).toBeTruthy();
      localStorage.removeItem(KEY_SHOW_LOG);
    });

    it('should return false when app not in isDevMode and localStorage hasn\'t KEY_SHOW_LOG item', () => {
      spyOn<any>(AngularCoreModule, 'isDevMode').and.returnValue(false);
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
