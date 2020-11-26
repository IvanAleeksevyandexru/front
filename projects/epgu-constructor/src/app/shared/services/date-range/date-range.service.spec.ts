import { TestBed } from '@angular/core/testing';

import { DateRangeService } from './date-range.service';
import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../../../component/components-list/components-list.types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { ComponentListFormService } from '../../../component/components-list/services/component-list-form.service';
import { ComponentListFormServiceStub } from '../../../component/components-list/services/component-list-form.service.stub';

describe('DateRangeService', () => {
  let service: DateRangeService;
  const componentMock: CustomComponent = {
    id: 'pd7_3',
    type: CustomScreenComponentTypes.DateInput,
    label: 'Дата выдачи',
    attrs: {
      ref: [],
      fields: [],
      dictionaryType: '',
      labelAttr: '',
      accuracy: 'day',
      maxDate: 'today',
      minDate: '-100y',
      validation: [],
    },
    value: '',
    required: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateRangeService,
        { provide: ComponentListFormService, useClass: ComponentListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    });
    service = TestBed.inject(DateRangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should be return min date', () => {
  // expect(service).toBeTruthy();
  // });

  // it('should be return max date', () => {
  // expect(service).toBeTruthy();
  // });

  it('should be clear date', () => {
    service.rangeMap.set(componentMock.id, { min: new Date(), max: new Date() });
    service.clearDate(componentMock.id, componentMock.attrs);
    const range = service.rangeMap.get(componentMock.id);
    expect(range).toEqual({ min: null, max: null });
  });

  // it('should be change date', () => {
  // expect(service).toBeTruthy();
  // });
});
