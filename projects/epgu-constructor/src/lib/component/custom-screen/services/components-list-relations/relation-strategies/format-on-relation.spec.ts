import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { FormatOnRelation } from './format-on-relation';
import { setupForRelationStrategy } from '../components-list-relations.mock';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';

describe('FormatOnRelation', () => {
  let relation: FormatOnRelation;
  let componentVal = { foo: 'bar' };
  let refRelationService: RefRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FormatOnRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(FormatOnRelation);
    refRelationService = TestBed.inject(RefRelationService);
    jest
      .spyOn(refRelationService, 'isDisplayOnRelation')
      .mockImplementation(
        (refRelation: CustomComponentRefRelation) =>
          refRelation === CustomComponentRefRelation.displayOn,
      );
    jest
      .spyOn(refRelationService, 'isDisplayOffRelation')
      .mockImplementation(
        (refRelation: CustomComponentRefRelation) =>
          refRelation === CustomComponentRefRelation.displayOff,
      );
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);
  });

  it('should set value from related component', () => {
    let { reference, dependentComponent, form, dependentControl } = setupForRelationStrategy({
      referenceExtra: {
        relatedRel: 'rf1',
        val: '*',
        relation: CustomComponentRefRelation.formatOn,
      },
      dependentComponentExtra: { id: 'dependentComponentId' },
    });

    const patchValue = jest.spyOn(dependentControl, 'patchValue');

    relation.handleRelation(dependentComponent, reference, componentVal, form);

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
