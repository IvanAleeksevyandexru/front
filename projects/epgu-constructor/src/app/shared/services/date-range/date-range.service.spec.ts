import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DateRangeService } from './date-range.service';
import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../../components/components-list/components-list.types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ApplicantAnswersDto } from '../../../form-player/services/form-player-api/form-player-api.types';
import { Attrs } from './date-range.models';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatesToolsService } from '../../../core/services/dates-tools/dates-tools.service';

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

  const MOCK_TODAY = '2021-01-01T00:00:00.000Z';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateRangeService,
        DatesToolsService,
        DictionaryApiService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DateRangeService);
    screenService = TestBed.inject(ScreenService);
    datesToolsService = TestBed.inject(DatesToolsService);
    jest.spyOn(datesToolsService, 'getToday').mockReturnValue(Promise.resolve(new Date(MOCK_TODAY)));
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return min date', async () => {
    const expectedResult = datesToolsService.toDate('2020-10-27T21:00:00.000Z');
    const minDate = await service.getMinDate(componentMock.attrs.ref, componentMock.id, new Date(), screenService.applicantAnswers);
    expect(minDate).toEqual(expectedResult);
  });

  it('should be return max date', async () => {
    const expectedResult = datesToolsService.toDate('2022-10-27T21:00:00.000Z');
    const maxDate = await service.getMaxDate(componentMock.attrs.ref, componentMock.id, new Date(), screenService.applicantAnswers);
    expect(maxDate).toEqual(expectedResult);
  });

  describe('clearDate()', () => {
    it('should be clear date', async () => {
      service.rangeMap.set(componentMock.id, { min: await datesToolsService.getToday(), max: await datesToolsService.getToday() });
      service.clearDate(componentMock.id, componentMock.attrs);
      const range = service.rangeMap.get(componentMock.id);

      expect(range).toEqual({ min: null, max: null });
    });

    it('should be not clear date without limit', async () => {
      const emptyMockAttr = {} as any;
      const minDate = await datesToolsService.getToday();
      const maxDate = await datesToolsService.getToday();
      service.rangeMap.set(componentMock.id, { min: minDate, max: maxDate });
      service.clearDate(componentMock.id, emptyMockAttr);
      const range = service.rangeMap.get(componentMock.id);

      expect(range).toEqual({ min: minDate, max: maxDate });
    });
  });

  describe('changeDate()', () => {
    it('should be void if has not control and attrs', async () => {
      const date = await datesToolsService.getToday();
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

      expect(range).toEqual({
        min: date,
        max: datesToolsService.toDate('2024-11-27T09:55:55.588Z'),
      });
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

      expect(range).toEqual({
        min: datesToolsService.toDate('2016-11-27T09:55:55.588Z'),
        max: date,
      });
    });
  });
});
