import { TestBed } from '@angular/core/testing';

import { DateRangeService } from './date-range.service';
import {
  CustomComponent,
  CustomScreenComponentTypes,
} from '../../../component/components-list/components-list.types';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';

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
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
      ],
    });
    service = TestBed.inject(DateRangeService);
  });

  it('should be created', () => {
    // expect(service).toBeTruthy();
  });

  it('should be return min date', () => {
    // expect(service).toBeTruthy();
  });

  it('should be return max date', () => {
    // expect(service).toBeTruthy();
  });

  it('should be clear date', () => {
    service.clearDate(componentMock.id, componentMock.attrs);
    const range = service.rangeMap.get(componentMock.id);
    expect(range).toEqual({ min: null, max: null });
  });

  it('should be change date', () => {
    // expect(service).toBeTruthy();
  });
});
