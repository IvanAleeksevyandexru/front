import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import {
  ComponentDto,
  DisplayDto,
} from '../../../form-player/services/form-player-api/form-player-api.types';
import { ISuggestionItem } from './autocomplete.inteface';

export const prepareClassifiedSuggestionItems = (
  suggestions: ISuggestionItem,
): { [key: string]: ISuggestionItem } => {
  let result: { [key: string]: ISuggestionItem } = {};
  if (suggestions) {
    const { mnemonic } = suggestions;
    suggestions.list.forEach((item) => {
      const { id, originalItem } = item;
      const parsedOriginalItem = JSON.parse(originalItem);
      Object.keys(parsedOriginalItem).forEach((fieldName) => {
        const itemList = {
          value: parsedOriginalItem[fieldName],
          mnemonic: `${mnemonic}.${fieldName}`,
          id,
        };
        if (result[fieldName]) {
          result[fieldName].list.push(itemList);
        } else {
          result[fieldName] = {
            mnemonic: fieldName,
            list: [itemList],
          };
        }
      });
    });
  }
  return result;
};

export const allowedAutocompleteComponentsList = (component: ComponentDto): boolean => {
  return (
    component.type === CustomScreenComponentTypes.DocInput ||
    component.type === UniqueScreenComponentTypes.registrationAddr ||
    component.type === UniqueScreenComponentTypes.confirmPersonalUserRegAddr ||
    component.type === UniqueScreenComponentTypes.employeeHistory
  );
};

export const getSuggestionGroupId = (display: DisplayDto): string => display.suggestion?.groupId;
