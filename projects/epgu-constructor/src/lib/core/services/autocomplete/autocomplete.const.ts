import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ISuggestionItem } from './autocomplete.inteface';
import { ComponentDto, DisplayDto } from '@epgu/epgu-constructor-types';
import { JsonHelperService } from '../json-helper/json-helper.service';

const jsonHelperService = new JsonHelperService();

export const prepareClassifiedSuggestionItems = (
  suggestions: ISuggestionItem,
  isDadataAddress?: boolean,
  fieldNames?: string[],
  componentsSuggestionsList?: [string, string][],
): { [key: string]: ISuggestionItem } => {
  let result: { [key: string]: ISuggestionItem } = {};
  const setItem = (item, fieldName, result) => {
    if (result[fieldName]) {
      result[fieldName].list.push(item);
    } else {
      result[fieldName] = {
        mnemonic: fieldName,
        list: [item],
      };
    }
  };

  if (suggestions) {
    const { mnemonic } = suggestions;
    suggestions.list.forEach((item) => {
      if (fieldNames?.length) {
        const fieldName = getFieldNameFromCompositeMnemonic(
          componentsSuggestionsList,
          item.mnemonic,
        );

        setItem(item, fieldName, result);
      } else {
        const { id, originalItem, value } = item;
        const parsedOriginalItem = jsonHelperService.tryToParse(originalItem, value);

        Object.keys(parsedOriginalItem).forEach((fieldName) => {
          const item = {
            value: isDadataAddress
              ? parsedOriginalItem[fieldName]['fullAddress']
              : parsedOriginalItem[fieldName],
            mnemonic: `${mnemonic}`,
            id,
          };

          setItem(item, fieldName, result);
        });
      }
    });
  }

  return result;
};

export const getFieldNameFromCompositeMnemonic = (componentsSuggestionsList, mnemonic): string =>
  componentsSuggestionsList.find(([suggestId]) => suggestId === mnemonic)?.[1].split('.')[1];

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

export const SUGGEST_SEPARATOR_DEFAULT = ', ';
