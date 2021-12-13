import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { FormatOnRelation } from './format-on-relation';
import { setupForRelationStrategy } from '../components-list-relations.mock';

describe('FormatOnRelation', () => {
  let relation: FormatOnRelation;
  let componentVal = { foo: 'bar' };
  const refRelationService: RefRelationService = (MockService(RefRelationService, {
    isDisplayOnRelation: jest
      .fn()
      .mockImplementation(
        (refRelation: CustomComponentRefRelation) =>
          refRelation === CustomComponentRefRelation.displayOn,
      ),
    isDisplayOffRelation: jest
      .fn()
      .mockImplementation(
        (refRelation: CustomComponentRefRelation) =>
          refRelation === CustomComponentRefRelation.displayOff,
      ),
    isValueEquals: jest.fn().mockReturnValue(false),
  }) as unknown) as RefRelationService;

  beforeEach(() => {
    relation = new FormatOnRelation(refRelationService);
  });

  it('should set value from related component', () => {
    let {
      reference,
      dependentComponent,
      form,
      shownElements,
      dependentControl,
    } = setupForRelationStrategy({
      referenceExtra: {
        relatedRel: 'rf1',
        val: '*',
        relation: CustomComponentRefRelation.formatOn,
      },
      dependentComponentExtra: { id: 'dependentComponentId' },
    });

    const patchValue = jest.spyOn(dependentControl, 'patchValue');

    relation.handleRelation(shownElements, dependentComponent, reference, componentVal, form);

    expect(patchValue).toBeCalled();
    expect(patchValue).toBeCalledTimes(1);
    expect(patchValue).toBeCalledWith(
      {
        id: 'dependentComponentId',
        value: { rf1: { foo: 'bar' } },
      },
      {
        emitEvent: false,
        onlySelf: true,
      },
    );
  });
});
