import { DictionaryItem, DictionaryResponse } from '../../../../../interfaces/dictionary-options.interface';
import { ListItem } from 'epgu-lib';

export function getTransformedDictionaryForMvgGiac(data: DictionaryResponse): Array<Partial<ListItem>> {
  return data.items.map((item) => adaptiveData(item));
}

function adaptiveData(item: DictionaryItem): Partial<ListItem> {
  return {
    id: item.value,
    text: item.title,
  };
}

export function getFilteredDictionaryForMvdGiac(
  dictionary: Array<Partial<ListItem>>,
  regionName: string): Array<Partial<ListItem>> | undefined {
  let filteredDictionary;

  filteredDictionary = dictionary.filter((item) => {
    return item.text.includes(regionName);
  });

  if (filteredDictionary.length === 0) {
    filteredDictionary = dictionary.filter((item) => {
      return item.text.includes(regionName.slice(0, -1));
    });
  }

  if (filteredDictionary.length === 0) {
    filteredDictionary = dictionary.filter((item) => {
      return item.text.includes(regionName.slice(0, -2));
    });
  }

  return filteredDictionary.length ? filteredDictionary : undefined;
}
