import { KeyValueMap } from '@epgu/epgu-constructor-types';
import { CustomComponent } from '../../components-list.types';

export const isCompoundComponentValid = (
  controlValue: KeyValueMap,
  component: CustomComponent,
): boolean => {
  const requiredIds = component.attrs.components
    .filter((componentDto) => componentDto.required)
    .map((componentDto) => componentDto.id);
  return Object.entries(controlValue).every(
    ([key, value]) => !requiredIds.includes(key) || !!value,
  );
};
