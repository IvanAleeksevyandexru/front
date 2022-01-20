import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatesToolsService, ConfigService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { ApplicantAnswersDto, CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { DateRangeService } from './date-range.service';
import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../../../component/custom-screen/components-list.types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { DateRangeAttrs } from './date-range.models';
import { DictionaryApiService } from '../dictionary/dictionary-api.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { createComponentMock } from '../../../component/custom-screen/services/components-list-relations/components-list-relations.mock';
import { MockProvider } from 'ng-mocks';
import { HelperService } from '@epgu/ui/services/helper';

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
        ConfigService,
        LoggerService,
        MockProvider(HelperService),
      ],
      imports: [HttpClientTestingModule],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(DateRangeService);
    screenService = TestBed.inject(ScreenService);
    datesToolsService = TestBed.inject(DatesToolsService);
    jest
      .spyOn(datesToolsService, 'getToday')
      .mockReturnValue(Promise.resolve(new Date(MOCK_TODAY)));
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue(applicantAnswersDto);
  });

  it('should be return min date', async () => {
    const expectedResult = datesToolsService.toDate('2020-10-27T21:00:00.000Z');
    const minDate = await service.getMinDate(
      componentMock.attrs.ref,
      componentMock.id,
      new Date(),
      screenService.applicantAnswers,
    );
    expect(minDate).toEqual(expectedResult);
  });

  it('should be return max date', async () => {
    const expectedResult = datesToolsService.toDate('2022-10-27T21:00:00.000Z');
    const maxDate = await service.getMaxDate(
      componentMock.attrs.ref,
      componentMock.id,
      new Date(),
      screenService.applicantAnswers,
    );
    expect(maxDate).toEqual(expectedResult);
  });

  describe('parsedDates()', () => {
    it('parsedDates should work for string and date', async () => {
      const resp1 = service.parsedDates(MOCK_TODAY, '01.10.2018');
      const resp2 = service.parsedDates(new Date(MOCK_TODAY), '01.10.2018');
      expect(resp1).toEqual({
        dateLeft: new Date(MOCK_TODAY),
        dateRight: new Date('10.01.2018'),
      });
      expect(resp2).toEqual({
        dateLeft: new Date(MOCK_TODAY),
        dateRight: new Date('10.01.2018'),
      });
    });
  });

  it('updateLimitDate should work', async () => {
    const dependentComponent = createComponentMock({
      attrs: {
        ref: [
          {
            relatedRel: 'pd7_3',
            val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
            relation: CustomComponentRefRelation.displayOn,
            relatedDate: 'pd7_3',
            period: 'years',
            condition: '>today',
          },
        ],
      },
    });

    const control = new FormGroup({
      id: new FormControl(dependentComponent.id),
      attrs: new FormControl(dependentComponent.attrs),
      value: new FormControl(dependentComponent.value),
    });
    const form = new FormArray([control]);
    await service.updateLimitDate(form, componentMock, dependentComponent, {});
    expect(control.get('attrs').value).toStrictEqual({
      ...dependentComponent.attrs,
      minDate: undefined,
      maxDate: undefined,
    });
  });

  describe('clearDate()', () => {
    it('should be clear date', async () => {
      service.rangeMap.set(componentMock.id, {
        min: await datesToolsService.getToday(),
        max: await datesToolsService.getToday(),
      });
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
      const mockAttrs: DateRangeAttrs = {
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
      const mockAttrs: DateRangeAttrs = {
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
