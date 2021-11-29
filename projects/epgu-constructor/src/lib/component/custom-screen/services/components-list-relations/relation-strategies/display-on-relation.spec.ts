import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { DisplayOnRelation } from './display-on-relation';
import { setupForRelationStrategy } from '../components-list-relations.mock';

describe('DisplayOnRelation', () => {
  let relation: DisplayOnRelation;
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
    relation = new DisplayOnRelation(refRelationService);
  });

  it('should update dependent control as touched when isShown == false', () => {
    let {
      reference,
      dependentComponent,
      dependentControl,
      form,
      shownElements,
    } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.displayOn },
      dependentComponentStatusExtra: { relation: CustomComponentRefRelation.displayOff }
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
      referenceExtra: { relation: CustomComponentRefRelation.displayOn },
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
        isShown: false,
        relation: CustomComponentRefRelation.displayOn,
      },
    });
  });

  it('should update dependent control as touched when isShown == false', () => {
    let {
      reference,
      dependentComponent,
      dependentControl,
      form,
      shownElements,
    } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.displayOn },
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
        isShown: false,
        relation: CustomComponentRefRelation.displayOn,
      },
    });
  });
});
