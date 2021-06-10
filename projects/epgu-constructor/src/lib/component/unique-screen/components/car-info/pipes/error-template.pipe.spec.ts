import { ErrorTemplatePipe } from './error-template.pipe';
import { ServiceResult } from '../models/car-info.interface';

describe('ErrorTemplatePipe', () => {
  const pipe = new ErrorTemplatePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should get an error template by type', () => {
    expect(pipe.transform(ServiceResult.NOT_FOUND_ERROR)).toEqual({ title:'Данные не найдены', icon: 'info-list-yellow-warning-icon' });
  });

  it('should get an empty object if a type is wrong', () => {
    expect(pipe.transform('NOT_EXISTING_ERROR')).toEqual({});
  });
});
