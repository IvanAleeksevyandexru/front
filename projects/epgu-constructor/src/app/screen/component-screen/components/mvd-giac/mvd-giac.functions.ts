import { ListItem } from 'epgu-lib';

export function getMainGiac(items: Array<Partial<ListItem>>): Array<Partial<ListItem>> {
  const mainGiacCode = '077';
  return items.filter(({ originalItem }) => originalItem?.value === mainGiacCode);
}

export function getUserRegion(items: Array<Partial<ListItem>>, userRegion: string): Array<Partial<ListItem>> {
  return items.filter(({ text: region }) => isUserRegionEqualToRegion(userRegion, region));
}

export function getUserRegionIndex(items: Array<Partial<ListItem>>, userRegion: string) {
  return items.findIndex(({ text: region }) => isUserRegionEqualToRegion(userRegion, region));
}

export function isUserRegionEqualToRegion(userRegion: string, region: string) {
  return region.includes(userRegion) ||
    region.includes(userRegion.slice(0, -1)) ||
    region.includes(userRegion.slice(0, -2));
}

export function getMvdGiasForUserAddress(dictionary: Array<Partial<ListItem>>, { q5, pd4, pd5 }): Array<Partial<ListItem>> {
  // <--- константы
  const baykanur = 'Байконур';
  // <--- значение предыдущих экранов
  const getCurrentRegion = (): string => JSON.parse(pd4?.value || '{}').regAddr?.region; // constant address
  const getRegRegion = (): string => JSON.parse(pd5?.value || '{}').regAddr?.region; // registration address
  // <--- проверки
  const saidAddressSame = () => q5.value === 'Да'; // Ранее ответил что адреса совпадают;
  const isSameRegion = () => getRegRegion() === getCurrentRegion();
  const isBaykanur = () => getCurrentRegion() === baykanur && getRegRegion() === baykanur;

  if (isBaykanur()) {
    return getMainGiac(dictionary);
  }
  if (saidAddressSame() || isSameRegion()) {
    return getUserRegion(dictionary, getCurrentRegion());
  }
  return dictionary;
}


/**
 * Сортировка основывается на том что в начале списка должны ноходиться пользовательские адреса
 * (постоянная, временная регистрация), а потом все другие адреса.
 */
export function getSortUserMvdGias(dictionary: Array<Partial<ListItem>>, { pd4, pd5 }): Array<Partial<ListItem>> {
  if (dictionary?.length > 1) {
    // <--- значение предыдущих экранов
    const currentRegion = JSON.parse(pd4?.value || '{}').regAddr?.region;
    const registrationRegion = JSON.parse(pd5?.value || '{}').regAddr?.region;

    // <--- данные
    const currentRegionIndex = getUserRegionIndex(dictionary, currentRegion);
    const registrationRegionIndex = getUserRegionIndex(dictionary, registrationRegion);

    // <--- проверки
    const hasCurrentRegion = () => currentRegionIndex !== -1;
    const hasRegistrationRegion = () => registrationRegionIndex !== -1;
    const isUserAddress = (i) => i === currentRegionIndex || i === registrationRegionIndex;

    const newDic = dictionary.filter((_, index) => !isUserAddress(index));
    if (hasCurrentRegion()) {
      newDic.unshift(dictionary[currentRegionIndex]);
    }
    if (hasRegistrationRegion()) {
      newDic.unshift(dictionary[registrationRegionIndex]);
    }
    return newDic;
  } else {
    return dictionary;
  }
}
