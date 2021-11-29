import { FormArray, FormBuilder } from '@angular/forms';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
} from '../../../components-list.types';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { CustomScreenComponentTypes } from '../../../components-list.types';
import { DisplayOffRelation } from './display-off-relation';
import { createComponentMock, setupForRelationStrategy } from '../components-list-relations.mock';

describe('DisplayOffRelation', () => {
  let relation: DisplayOffRelation;
  let componentVal =  { foo: 'bar' };
  const refRelationService: RefRelationService = MockService(RefRelationService, {
    isDisplayOnRelation: jest.fn().mockImplementation(
      (relation: CustomComponentRefRelation) => relation === CustomComponentRefRelation.displayOn
    ),
    isDisplayOffRelation: jest.fn().mockImplementation(
      (relation: CustomComponentRefRelation) => relation === CustomComponentRefRelation.displayOff
    ),
    isValueEquals: jest.fn().mockReturnValue(false),
  }) as unknown as RefRelationService;

  beforeEach(() => {
    relation = new DisplayOffRelation(refRelationService);
  });

  it('should update dependent control as touched when isShown == false', () => {
    let {
      reference,
      dependentComponent,
      dependentControl,
      form,
      shownElements,
    } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.displayOff },
    });

    dependentControl.markAsTouched();

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
    );

    // потому что isShown === false AND isDisplayOn
    expect(dependentControl.touched).toBeTruthy();
    expect(shownElements).toEqual({
      [dependentComponent.id]: {
        isShown: false,
        relation: CustomComponentRefRelation.displayOn,
      },
    });
  });

  it('should update dependent control as touched when isShown == true', () => {
    let {
      reference,
      dependentComponent,
      dependentControl,
      form,
      shownElements,
    } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.displayOff },
      dependentComponentStatusExtra: { isShown: true }
    });

    dependentControl.markAsTouched();

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
    );

    // потому что isShown === true
    expect(dependentControl.touched).toBeFalsy();
    expect(shownElements).toEqual({
      [dependentComponent.id]: {
        isShown: true,
        relation: CustomComponentRefRelation.displayOff,
      },
    });
  });

  it('should update dependent control as touched when isShown == true', () => {
    let {
      reference,
      dependentComponent,
      dependentControl,
      form,
      shownElements,
    } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.displayOff },
      dependentComponentStatusExtra: { relation: CustomComponentRefRelation.getValue }
    });

    dependentControl.markAsTouched();

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
    );

    // потому что NOT isDisplayOn
    expect(dependentControl.touched).toBeFalsy();
    expect(shownElements).toEqual({
      [dependentComponent.id]: {
        isShown: true,
        relation: CustomComponentRefRelation.displayOff,
      },
    });
  });

  it('should hide dependent component if at least one of ref value condition is true', () => {
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    const fb = new FormBuilder();
    const form1 = fb.group({
      ...createComponentMock(),
      value: true,
      id: 'rp1_1',
    });
    const form2 = fb.group({
      ...createComponentMock(),
      value: false,
      id: 'rp1_2',
    });
    const form3 = fb.group({ ...createComponentMock(),
      id: 'rp1_3', });
    const mockForm = new FormArray([form1, form2, form3]);

    const shownElements: CustomListStatusElements = {
      rp1_1: {
        isShown: true,
        relation: CustomComponentRefRelation.displayOff,
      },
      rp1_2: {
        isShown: true,
        relation: CustomComponentRefRelation.displayOff,
      },
      rp1_3: {
        isShown: true,
        relation: CustomComponentRefRelation.displayOff,
      }
    };
    const dependentComponent: CustomComponent = {
      attrs: {
        ref: [
          {
            relatedRel: 'rp1_1',
            val: true,
            relation: CustomComponentRefRelation.displayOff,
          },
          {
            relatedRel: 'rp1_2',
            val: true,
            relation: CustomComponentRefRelation.displayOff,
          }
        ]
      },
      id: 'rp1_3',
      type: CustomScreenComponentTypes.LabelSection
    };
    const reference: CustomComponentRef = {
      relatedRel: 'rp1_3',
      relation: CustomComponentRefRelation.displayOff,
      val: true,
    };

    expect(shownElements['rp1_3'].isShown).toEqual(true);

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      {},
      mockForm,
    );

    expect(shownElements['rp1_3'].isShown).toEqual(false);
  });
});
