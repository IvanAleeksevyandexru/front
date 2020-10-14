import { ListItem } from 'epgu-lib';

export function getMainGiac(items: Array<Partial<ListItem>>): Array<Partial<ListItem>> {
  const mainGiacCode = '85';
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

export function getMvdGiasForUserAddress(
  dictionary: Array<Partial<ListItem>>,
  regAddrRegion,
  factAddrRegion,
  saidAddressSame
): Array<Partial<ListItem>> {
  const baykanur = 'Байконур';
  const isSameRegion = () => regAddrRegion === factAddrRegion;
  const isBaykanur = () => regAddrRegion === baykanur && factAddrRegion === baykanur;

  if (isBaykanur()) {
    return getMainGiac(dictionary);
  }
  if (saidAddressSame || isSameRegion()) {
    return getUserRegion(dictionary, regAddrRegion);
  }
  return dictionary;
}


/**
 * Сортировка основывается на том что в начале списка должны ноходиться пользовательские адреса
 * (постоянная, временная регистрация), а потом все другие адреса.
 */
export function getSortUserMvdGias(
  dictionary: Array<Partial<ListItem>>,
  regAddrRegion,
  factAddrRegion
): Array<Partial<ListItem>> {
  if (dictionary?.length > 1) {
    // <--- данные
    const currentRegionIndex = getUserRegionIndex(dictionary, factAddrRegion);
    const registrationRegionIndex = getUserRegionIndex(dictionary, regAddrRegion);

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
