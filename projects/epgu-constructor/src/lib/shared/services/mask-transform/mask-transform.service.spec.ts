import { DecimalPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { MaskTransformService } from '../../services/mask-transform/mask-transform.service';

describe('MaskTransformService', () => {
  let service: MaskTransformService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [DecimalPipe, MaskTransformService],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaskTransformService);
  });

  it('transformNumberMaskInput should provide correct format', () => {
    let value = 's1!2$3_1+2s3s';
    let result = service.transformNumberMaskInput(value, {});
    expect(result).toBe('123 123.00');

    value = 's1!2$3_1+2s3s,9';
    const maskOptions = {
      decimalSymbol: ',',
    };
    result = service.transformNumberMaskInput(value, maskOptions);
    expect(result).toBe('123 123,90');
  });
});
