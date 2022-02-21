import { CustomComponent } from '../../components-list.types';
import { isCompoundComponentValid } from './CalendarInputValidations';

describe('isCompoundComponentValid', () => {
  const mockData = {
    attrs: {
      components: [
        { id: 'q1', required: true },
        { id: 'q2', required: false },
      ],
    },
  };
  const mockValue = { q1: 'true', q2: '' };

  it('should be valid', () => {
    expect(
      isCompoundComponentValid(mockValue, (mockData as unknown) as CustomComponent),
    ).toBeTruthy();
  });

  it('should be invalid', () => {
    mockData.attrs.components[1].required = true;
    expect(
      isCompoundComponentValid(mockValue, (mockData as unknown) as CustomComponent),
    ).toBeFalsy();
  });

  it('should be valid', () => {
    mockValue.q2 = '1';
    expect(
      isCompoundComponentValid(mockValue, (mockData as unknown) as CustomComponent),
    ).toBeTruthy();
  });
});
