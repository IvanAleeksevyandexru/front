import {
  ConfirmUserDataAdaptiveFieldInterface,
  ConfirmUserDataInterface
} from '../../../../../../../../../interfaces/confirm-user-data.interface';

export const FULL_NAME_FIELD_ITEMS = ['firstName', 'lastName', 'middleName'];
export const CONFIRM_USER_DATA_BIRTHDAY_FIELD_NAME = 'birthDate';


export function getFullNameConfirmPersonalUserData(data: ConfirmUserDataInterface): string {
  const includeItem = (arr, item) => arr.includes(item);
  return (
    data.attrs.fields
      .filter((item) => includeItem(FULL_NAME_FIELD_ITEMS, item.fieldName))
      // eslint-disable-next-line no-return-assign, no-param-reassign
      .reduce((acc, item) => (acc += ` ${JSONParse(data, item.fieldName)}`), '')
      .trim()
  );
}

export function getBirthDayConfirmPersonalUserData(data: ConfirmUserDataInterface): ConfirmUserDataAdaptiveFieldInterface {
  const birthDate = data.attrs.fields.find((item) => item.fieldName === CONFIRM_USER_DATA_BIRTHDAY_FIELD_NAME);
  return {
    label: birthDate.label,
    value: JSONParse(data, birthDate.fieldName),
  };
}

/**
 * Функция исключает список список filed(-ов) {@link getBirthDay} {@link getFullName}
 */
export function getOtherFieldsConfirmPersonalUserData(data: ConfirmUserDataInterface): Array<ConfirmUserDataAdaptiveFieldInterface> {
  const includeItem = (arr, item) => arr.includes(item);
  const excludeFieldList = FULL_NAME_FIELD_ITEMS.concat([CONFIRM_USER_DATA_BIRTHDAY_FIELD_NAME]);
  return data.attrs.fields
    .filter((item) => !includeItem(excludeFieldList, item.fieldName))
    .map((item) => ({ label: item.label, value: JSONParse(data, item.fieldName) }));
}

function JSONParse(data: ConfirmUserDataInterface, fieldName) {
  return JSON.parse(data.value)[fieldName];
}
