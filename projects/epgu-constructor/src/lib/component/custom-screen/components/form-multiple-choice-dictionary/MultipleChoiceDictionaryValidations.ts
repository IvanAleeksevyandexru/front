import { ValidationServiceContext } from '@epgu/epgu-constructor-types';
import { MultipleSelectedItems } from '../../../../shared/components/multiple-choice-dictionary/multiple-choice-dictionary.models';
import { CustomComponent, CustomComponentValidationConditions } from '../../components-list.types';

export const isMultipleSelectedItemsValid = (
  selectedItems: MultipleSelectedItems,
  _component?: CustomComponent,
  ctx?: ValidationServiceContext,
): boolean => {
  const { jsonHelperService } = ctx || {};
  const parsedValue = getParsedValue(selectedItems, jsonHelperService);
  const atLeastOne = _component?.attrs?.validation?.find(
    (v) => v.condition === CustomComponentValidationConditions.atLeastOne,
  );
  if (atLeastOne) {
    return true;
  }
  return parsedValue && !!(parsedValue as MultipleSelectedItems).amount;
};

const getParsedValue = (value: string | unknown, jsonHelperService): unknown => {
  const isParsable = jsonHelperService.hasJsonStructure(value as string);
  return isParsable ? JSON.parse(value as string) : value;
};
