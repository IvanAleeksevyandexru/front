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
