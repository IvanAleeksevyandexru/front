import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ISuggestionItem } from './autocomplete.inteface';
import { ComponentDto, DisplayDto } from 'epgu-constructor-types';

export const prepareClassifiedSuggestionItems = (
  suggestions: ISuggestionItem,
  isDadataAddress?: boolean,
): { [key: string]: ISuggestionItem } => {
  let result: { [key: string]: ISuggestionItem } = {};
  if (suggestions) {
    const { mnemonic } = suggestions;
    suggestions.list.forEach((item) => {
      const { id, originalItem } = item;
      const parsedOriginalItem = JSON.parse(originalItem);
      Object.keys(parsedOriginalItem).forEach((fieldName) => {
        const itemList = {
          value: isDadataAddress
            ? parsedOriginalItem[fieldName]['fullAddress']
            : parsedOriginalItem[fieldName],
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
    component.type === UniqueScreenComponentTypes.confirmPersonalUserRegAddr
  );
};

export const autofillComponentsList: [UniqueScreenComponentTypes | CustomScreenComponentTypes] = [
  UniqueScreenComponentTypes.employeeHistory,
];

export const getSuggestionGroupId = (display: DisplayDto): string => display.suggestion?.groupId;

export const isChildrenListType = (component): boolean => {
  return [
    UniqueScreenComponentTypes.childrenList,
    UniqueScreenComponentTypes.childrenListAbove14,
    UniqueScreenComponentTypes.childrenListUnder14,
  ].includes(component.type as UniqueScreenComponentTypes);
};
