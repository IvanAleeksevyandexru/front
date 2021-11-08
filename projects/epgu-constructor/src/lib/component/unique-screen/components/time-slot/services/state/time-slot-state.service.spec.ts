import { TestBed } from '@angular/core/testing';

import { TimeSlotStateService } from './time-slot-state.service';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { CurrentAnswersServiceStub } from '../../../../../../screen/current-answers-service.stub';
import {
  DatesToolsService,
  DatesToolsServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { Slot } from '../../typings';

const createMockSlot = (id: string, date: string) =>
  ({
    slotId: id,
    timezone: '+3',
    slotTime: new Date(date),
  } as Slot);

describe('TimeSlotStateService', () => {
  let service: TimeSlotStateService;
  let modalService: ModalService;
  let currentAnswersService: CurrentAnswersService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TimeSlotStateService,
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: CurrentAnswersService, useClass: CurrentAnswersServiceStub },
      ],
    });
    service = TestBed.inject(TimeSlotStateService);
    modalService = TestBed.inject(ModalService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
  });

  describe('base', () => {
    it('should be showModal', () => {
      jest.spyOn(modalService, 'openModal');
      service.showModal({});
      expect(modalService.openModal).toHaveBeenCalled();
    });

    it('should be setAdditionalDisplayingButton', (done) => {
      service.setAdditionalDisplayingButton(true);
      service.additionalDisplayingButton$.subscribe((v) => {
        expect(v).toBeTruthy();
        done();
      });
    });

    it('should be setMonth', (done) => {
      const testCase = '2012-12';
      service.setMonth(testCase);
      service.month$.subscribe((v) => {
        expect(v).toBe(testCase);
        done();
      });
    });

    it('should be setMonths', (done) => {
      const testCase = '2012-12';
      service.setMonths([testCase]);
      service.months$.subscribe((v) => {
        expect(v).toEqual([testCase]);
        done();
      });
    });
    it('should be setList', (done) => {
      const testCase = [createMockSlot('id', '2012-12-12')];
      service.setList(testCase);
      service.list$.subscribe((v) => {
        expect(v).toEqual(testCase);
        done();
      });
    });
    it('should be setSlot', (done) => {
      const testCase = createMockSlot('id', '2012-12-12');
      service.setSlot(testCase);
      service.slot$.subscribe((v) => {
        expect(v).toEqual(testCase);
        done();
      });
    });
    it('should be setDay', (done) => {
      const testCase = new Date('2012-12-12');
      service.setDay(testCase);
      service.day$.subscribe((v) => {
        expect(v).toEqual(testCase);
        done();
      });
    });
    it('should be progress', (done) => {
      service.progressStart();
      service.progressStart();
      expect(service['progressCounter$$'].getValue()).toBe(2);
      service.progressEnd();
      service.progressEnd();
      expect(service['progressCounter$$'].getValue()).toBe(0);
      service.progress$.subscribe((result) => {
        expect(result).toBeFalsy();
        done();
      });
    });
    it('should be clearSlot', () => {
      jest.spyOn(service, 'setResult');
      service.setSlot(createMockSlot('id', '2012-12-12'));
      service.clearSlot();
      expect(service.slot).toBeNull();
      expect(service.setResult).toHaveBeenCalledWith(null);
    });
    it('should be clearDay', () => {
      jest.spyOn(service, 'clearSlot');
      service.setDay(new Date('2012-12-12'));
      service.clearDay();

      expect(service.day).toBeNull();
      expect(service.clearSlot).toHaveBeenCalled();
    });
    it('should be setResult', () => {
      const fn = jest.fn();
      jest.spyOn(currentAnswersService, 'state', 'set').mockImplementation(fn);
      const testCase = {};
      service.setResult(testCase);
      expect(fn).toHaveBeenCalledWith(testCase);
    });
  });
});
