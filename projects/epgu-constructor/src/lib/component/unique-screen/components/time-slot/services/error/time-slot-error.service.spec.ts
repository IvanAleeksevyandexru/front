import { TestBed } from '@angular/core/testing';
import { TimeSlotErrorService } from './time-slot-error.service';
import { TimeSlotsConstants } from '../../../time-slots/time-slots.constants';
import { Injector } from '@angular/core';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { TimeSlotSmev3StateService } from '../smev3-state/time-slot-smev3-state.service';
import { TimeSlotSmev3StateServiceStub } from '../smev3-state/time-slot-smev3-state.service.stub';
import {
  nextHandler,
  TimeSlotError,
  TimeSlotErrorHandler,
  TimeSlotRequestType,
  TimeSlotTemplateType,
} from '../../typings';

describe('TimeSlotErrorService', () => {
  let service: TimeSlotErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TimeSlotSmev3StateService, useClass: TimeSlotSmev3StateServiceStub },
        TimeSlotsConstants,
        TimeSlotErrorService,
        Injector,
        { provide: ModalService, useClass: ModalServiceStub },
      ],
    });
    service = TestBed.inject(TimeSlotErrorService);
  });

  describe('base', () => {
    it('should be reset', () => {
      const result = { code: 1, message: 'test', type: TimeSlotRequestType.list };
      service.setError(result.type, result.message, result.code);
      service.reset();
      expect(service.getError()).toBe(null);
    });
    it('should be setError & getError', () => {
      const result = { code: 1, message: 'test', type: TimeSlotRequestType.list };
      service.setError(result.type, result.message, result.code);

      expect(service.getError()).toEqual(result);
    });
    it('should be hasError', () => {
      const result = { code: 1, message: 'test', type: TimeSlotRequestType.list };
      service.setError(result.type, result.message, result.code);
      expect(service.hasError()).toBeTruthy();
      service.reset();
      expect(service.hasError()).toBeFalsy();
    });
    it('should be getErrorCode', () => {
      const result = { code: 1, message: 'test', type: TimeSlotRequestType.list };
      service.setError(result.type, result.message, result.code);
      expect(service.getErrorCode()).toBe(result.code);
    });
    it('should be getErrorMessage', () => {
      const result = { code: 1, message: 'test', type: TimeSlotRequestType.list };
      service.setError(result.type, result.message, result.code);
      expect(service.getErrorMessage()).toBe(result.message);
    });

    it('should be show', () => {
      jest.spyOn(service.show$$, 'next');
      service.show('test');
      expect(service.show$$.next).toHaveBeenCalledWith('test');
    });
  });
  describe('middleware', () => {
    it('should be addHandlers', () => {
      const handlers = [
        ((() => null) as unknown) as TimeSlotErrorHandler,
        ((() => null) as unknown) as TimeSlotErrorHandler,
      ];
      expect(service.errorHandlers.length).toBe(0);
      service.addHandlers(handlers);
      expect(service.errorHandlers.length).toBe(2);
    });

    it('should be addHandler', () => {
      service.addHandler(((() => null) as unknown) as TimeSlotErrorHandler);
      expect(service.errorHandlers.length).toBe(1);
      service.resetHandlers();
      expect(service.errorHandlers.length).toBe(0);
    });

    it('should be handling', () => {
      const fn = jest.fn();
      const fn2 = jest.fn();
      const handlers = [
        (error?: TimeSlotError, injector?: Injector, next?: nextHandler) => {
          fn();
          next(error);
        },
        (error?: TimeSlotError, injector?: Injector, next?: nextHandler) => {
          fn2();
          next(error);
        },
      ];
      service.addHandlers(handlers);
      service.handling({} as TimeSlotError, 0);
      expect(fn).toHaveBeenCalled();
      expect(fn2).toHaveBeenCalled();
    });

    it('should be endHandler', () => {
      const fn = jest.fn();
      service.endHandler = fn;
      service.handling({} as TimeSlotError, 0);
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    const testCase = { header: 'test', description: 'test' };
    const testCase2 = { header: 'test2', description: 'test2' };
    it('should be setTemplate & getTemplate', () => {
      service.setTemplate(TimeSlotTemplateType.SLOTS_NOT_FOUND, testCase);
      expect(service.getTemplate(TimeSlotTemplateType.SLOTS_NOT_FOUND)).toBe(testCase);
    });

    it('should be setAllTemplates & getTemplates', () => {
      const list = {
        [TimeSlotTemplateType.SLOTS_NOT_FOUND]: testCase,
        [TimeSlotTemplateType.DAYS_NOT_FOUND]: testCase2,
      };
      service.setAllTemplates(list);
      expect(service.getTemplates()).toBe(list);
    });
  });
});
