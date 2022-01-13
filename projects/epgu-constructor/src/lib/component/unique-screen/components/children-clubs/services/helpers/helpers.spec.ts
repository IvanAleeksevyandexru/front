import { countFilters } from './helpers';
import { Filters, FindOptionsGroup } from '../../models/children-clubs.types';

const mockFilters: Filters = {
  isRegistrationOpen: true,
  query: '123',
  onlyDistanceProgram: false,
};

const mockExceptions: (keyof Filters | keyof FindOptionsGroup)[] = ['isRegistrationOpen'];

describe('Helpers countFilters()', () => {
  it('should return number', () => {
    expect(typeof countFilters(mockFilters, mockExceptions)).toBe('number');
  });

  it('should return 0, if no filters passed', () => {
    expect(countFilters({}, [])).toBe(0);
  });

  it('should take exceptions into account', () => {
    expect(countFilters(mockFilters, mockExceptions)).toBe(1);
    expect(countFilters(mockFilters, [])).toBe(2);
  });
});
