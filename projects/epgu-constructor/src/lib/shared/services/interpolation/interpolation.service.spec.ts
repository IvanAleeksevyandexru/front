import { TestBed } from '@angular/core/testing';
import { InterpolationService } from './interpolation.service';
import { configureTestSuite } from 'ng-bullet';

describe('InterpolationService', () => {
  let service: InterpolationService;
  let componentAttrs = {
    label: 'Some label ${var1}, ${obj1.var2}',
    value: { var1: 'one var', obj1: { var2: 'second var' }}
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [InterpolationService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(InterpolationService);
  });

  it('should interpolate variables to string', () => {
    const vars = {
      variable: 'var',
      obj: {
        deep_variable: 'go deeper',
      }
    };
    expect(service.interpolateString('Some ${variable} ${obj.deep_variable}', vars)).toBe('Some var go deeper');
  });

  it('should keep variable placeholder if variable not found', () => {
    const vars = { variable: 'var' };
    expect(service.interpolateString('Some ${variable} ${no.var.here}', vars)).toBe('Some var ${no.var.here}');
  });

  it('should interpolate variables to object', () => {
    const result = service.interpolateObject(componentAttrs, componentAttrs.value);

    expect(result).toEqual({
      label: 'Some label one var, second var',
      value: { var1: 'one var', obj1: { var2: 'second var' }}
    });
  });
});
