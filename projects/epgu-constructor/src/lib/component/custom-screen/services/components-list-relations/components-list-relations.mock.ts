import { CustomComponent, CustomComponentRef, CustomScreenComponentTypes } from '../../components-list.types';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { isArray as _isArray, mergeWith as _mergeWith } from 'lodash';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { BaseRelation } from './relation-strategies/base-relation';

export let componentMock: CustomComponent = {
  id: 'rf1',
  type: CustomScreenComponentTypes.StringInput,
  label: 'Прежняя фамилия',
  attrs: {
    dictionaryType: '',
    ref: [
      {
        relatedRel: 'rf1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      },
    ],
    labelAttr: '',
    fields: [],
    validation: [
      {
        type: 'RegExp',
        value: '^.{0,10}$',
        ref: '',
        dataType: '',
        condition: '',
        errorMsg: 'Поле может содержать не более 10 символов',
        updateOn: 'change',
      },
      {
        type: 'RegExp',
        value: '^[-а-яА-ЯЁё0-9 .,/]+$',
        ref: '',
        dataType: '',
        condition: '',
        errorMsg:
          'Поле может содержать только русские буквы, дефис, пробел, точку, а также цифры',
        updateOn: 'change',
      },
      {
        type: 'RegExp',
        value: '^.{9}$',
        ref: '',
        dataType: '',
        condition: '',
        errorMsg: 'Поле должно содержать 9 символов',
        updateOn: 'blur',
      },
      {
        type: 'RegExp',
        value: '.*[0-9]+.*',
        ref: '',
        dataType: '',
        condition: '',
        errorMsg: 'Поле должно содержать хотя бы одну цифру',
        updateOn: 'blur',
      },
    ],
  },
  value: '4',
  required: true,
};

export const createComponentMock = (
  mergedData: unknown = {},
  component: CustomComponent = componentMock,
): CustomComponent => {
  return _mergeWith({}, component, mergedData, (objValue, srcValue) => {
    if (_isArray(objValue)) {
      return srcValue;
    }
  });
};

export const setupForRelationStrategy = ({
  dependentControlValue = '',
  dependentComponentExtra = {},
  referenceExtra = {},
  dependentComponentStatusExtra = {},
}) => {
  const reference: CustomComponentRef = _mergeWith({
    relatedRel: 'rf1',
    val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
    relation: CustomComponentRefRelation.displayOff,
  }, referenceExtra);

  const dependentComponent = _mergeWith(
    createComponentMock({
      attrs: {
        ref: [
          {
            relatedRel: 'rf1',
            val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
            relation: CustomComponentRefRelation.displayOn,
          },
        ],
      },
    }),
    dependentComponentExtra,
  );

  const dependentControl = new FormGroup({
    id: new FormControl(dependentComponent.id),
    value: new FormControl(dependentControlValue),
  });
  const form = new FormArray([dependentControl]);

  const dependentComponentStatus = _mergeWith({
    isShown: false,
    relation: CustomComponentRefRelation.displayOn,
  },
    dependentComponentStatusExtra
  );
  const shownElements = {
    [dependentComponent.id]: dependentComponentStatus,
  };

  return { reference, dependentComponent, dependentControl, form, dependentComponentStatus, shownElements };
};
