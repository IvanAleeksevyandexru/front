import { TestBed } from '@angular/core/testing';
import { DateRangeService } from './date-range.service';
import { CustomComponent, CustomScreenComponentTypes } from '../../components-list.types';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { ApplicantAnswersDto } from '../../../../../../form-player/services/form-player-api/form-player-api.types';
import { Attrs } from './date-range.models';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';

describe('DateRangeService', () => {
  let service: DateRangeService;
  let screenService: ScreenService;
  let datesToolsService: DatesToolsService;
  const componentMock: CustomComponent = {
    id: 'pd7_3',
    type: CustomScreenComponentTypes.DateInput,
    label: 'Дата выдачи',
    attrs: {
      ref: [{ relatedDate: 'pd15', val: '2', period: 'years', condition: '>=' }],
      fields: [],
      dictionaryType: '',
      labelAttr: '',
      accuracy: 'day',
      maxDate: 'today',
      minDate: '-100y',
      validation: [],
      limit: '5',
    },
    value: '',
    required: true,
  };
  const applicantAnswersDto: ApplicantAnswersDto = {
    pd15: { value: '2020-10-28T00:00:00.000+03:00', visited: false },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateRangeService, DatesToolsService, { provide: ScreenService, useClass: ScreenServiceStub }],
    });
    service = TestBed.inject(DateRangeService);
    screenService = TestBed.inject(ScreenService);
    datesToolsService = TestBed.inject(DatesToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return min date', () => {
    const expectedResult = datesToolsService.toDate('2020-10-27T21:00:00.000Z');
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
    const minDate = service.getMinDate(componentMock.attrs.ref, componentMock.id, new Date());

    expect(minDate).toEqual(expectedResult);
  });

  it('should be return max date', () => {
    const expectedResult = datesToolsService.toDate('2022-10-27T21:00:00.000Z');
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
    const maxDate = service.getMaxDate(componentMock.attrs.ref, componentMock.id, new Date());

    expect(maxDate).toEqual(expectedResult);
  });

  describe('clearDate()', () => {
    it('should be clear date', () => {
      service.rangeMap.set(componentMock.id, { min: datesToolsService.getToday(), max: datesToolsService.getToday() });
      service.clearDate(componentMock.id, componentMock.attrs);
      const range = service.rangeMap.get(componentMock.id);

      expect(range).toEqual({ min: null, max: null });
    });

    it('should be not clear date without limit', () => {
      const emptyMockAttr = {} as any;
      const minDate = datesToolsService.getToday();
      const maxDate = datesToolsService.getToday();
      service.rangeMap.set(componentMock.id, { min: minDate, max: maxDate });
      service.clearDate(componentMock.id, emptyMockAttr);
      const range = service.rangeMap.get(componentMock.id);

      expect(range).toEqual({ min: minDate, max: maxDate });
    });
  });

  describe('changeDate()', () => {
    it('should be void if has not control and attrs', () => {
      const date = datesToolsService.getToday();
      expect(service.changeDate({} as any, date)).toBe(undefined);
    });

    it('should be set date to if has attrs.to', () => {
      const mockAttrs: Attrs = {
        limit: '4',
        to: '2',
      } as any;
      const mockId = '5';
      const date = datesToolsService.toDate('2020-11-27T09:55:55.588Z');
      service.changeDate(mockAttrs, date);
      const range = service.rangeMap.get(mockAttrs.to);

      expect(range).toEqual({ min: date, max: datesToolsService.toDate('2024-11-27T09:55:55.588Z') });
    });

    it('should be set date to if has attrs.from', () => {
      const mockAttrs: Attrs = {
        limit: '4',
        from: '2',
      } as any;
      const mockId = '5';
      const date = datesToolsService.toDate('2020-11-27T09:55:55.588Z');
      service.changeDate(mockAttrs, date);
      const range = service.rangeMap.get(mockAttrs.from);

      expect(range).toEqual({ min: datesToolsService.toDate('2016-11-27T09:55:55.588Z'), max: date });
    });
  });
});