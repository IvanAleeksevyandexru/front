import { ComponentDto, DisplayDto } from '@epgu/epgu-constructor-types';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { CustomScreenComponentTypes } from '../../../component/custom-screen/components-list.types';
import { UniqueScreenComponentTypes } from '../../../component/unique-screen/unique-screen-components.types';
import { ISuggestionItem } from './autocomplete.inteface';

const jsonHelperService = new JsonHelperService();

export const prepareClassifiedSuggestionItems = (
  suggestions: ISuggestionItem,
  isDadataAddress?: boolean,
  fieldNames?: string[],
  componentsSuggestionsList?: [string, string][],
): { [key: string]: ISuggestionItem } => {
  const result: { [key: string]: ISuggestionItem } = {};
  const setItem = (item, fieldName, total) => {
    if (total[fieldName]) {
      total[fieldName].list.push(item);
    } else {
      total[fieldName] = {
        mnemonic: fieldName,
        list: [item],
      };
    }
  };

  if (suggestions) {
    const { mnemonic } = suggestions;
    suggestions.list.forEach((item) => {
      if (fieldNames?.length) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const fieldName = getFieldNameFromCompositeMnemonic(
          componentsSuggestionsList,
          item.mnemonic,
        );

        setItem(item, fieldName, result);
      } else {
        const { id, originalItem, value } = item;
        const parsedOriginalItem = jsonHelperService.tryToParse(originalItem, value);

        Object.keys(parsedOriginalItem).forEach((fieldName) => {
          const parsedItem = {
            value: isDadataAddress
              ? parsedOriginalItem[fieldName].fullAddress
              : parsedOriginalItem[fieldName],
            mnemonic: `${mnemonic}`,
            id,
          };

          setItem(parsedItem, fieldName, result);
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
  return [UniqueScreenComponentTypes.childrenList].includes(
    component.type as UniqueScreenComponentTypes,
  );
};

export const SUGGEST_SEPARATOR_DEFAULT = ', ';
