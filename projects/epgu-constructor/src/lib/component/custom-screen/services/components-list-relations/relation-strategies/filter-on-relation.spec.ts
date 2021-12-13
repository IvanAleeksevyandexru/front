import { CustomComponent } from '../../../components-list.types';
import {
  CustomComponentRefRelation,
  DictionaryConditions,
  DictionaryValueTypes,
} from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { FilterOnRelation } from './filter-on-relation';
import { setupForRelationStrategy } from '../components-list-relations.mock';
import { Observable } from 'rxjs';
import { UpdateFilterEvent, UpdateFiltersEvents } from '../components-list-relations.interface';

describe('FilterOnRelation', () => {
  let relation: FilterOnRelation;
  let componentVal = { foo: 'bar', regOkato: '123' };
  let components: CustomComponent[] = [];
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
    relation = new FilterOnRelation(refRelationService);
  });

  it('should apply filter if isValueEquals() AND isDictionaryLike()', () => {
    const referenceExtra = {
      relation: CustomComponentRefRelation.filterOn,
      dictionaryFilter: [
        {
          attributeName: 'okato',
          condition: DictionaryConditions.EQUALS,
          value: 'regOkato',
          valueType: DictionaryValueTypes.preset,
        },
      ],
    };
    let { reference, dependentComponent, form, shownElements } = setupForRelationStrategy({
      referenceExtra,
    });

    const resultFilter = { reference, value: componentVal };

    const applyFilterSpy = jest
      .spyOn<FilterOnRelation, any>(relation, 'applyFilter')
      .mockReturnValue(undefined);
    const clearFilterSpy = jest
      .spyOn<FilterOnRelation, any>(relation, 'clearFilter')
      .mockReturnValue(undefined);

    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      false,
    );

    // вызывается applyFilter(), потому что isValueEquals() === TRUE AND isDictionaryLike() === TRUE
    expect(clearFilterSpy).not.toBeCalled();
    expect(applyFilterSpy).toBeCalledTimes(1);
    expect(applyFilterSpy).toBeCalledWith(dependentComponent.id, resultFilter);
  });

  it('should apply filter if isValueEquals() AND isDictionaryLike()', () => {
    let { reference, dependentComponent, form, shownElements } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.filterOn },
    });

    const applyFilterSpy = jest
      .spyOn<FilterOnRelation, any>(relation, 'applyFilter')
      .mockReturnValue(undefined);
    const clearFilterSpy = jest
      .spyOn<FilterOnRelation, any>(relation, 'clearFilter')
      .mockReturnValue(undefined);

    clearFilterSpy.mockClear();
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      false,
    );

    // вызывается clearFilter(), потому что isValueEquals() === FALSE
    expect(applyFilterSpy).not.toBeCalled();
    expect(clearFilterSpy).toBeCalledTimes(1);
    expect(clearFilterSpy).toBeCalledWith(dependentComponent.id);
  });

  describe('applyFilter()', () => {
    it('should apply passed filter for dependent component', () => {
      const dependentComponentId = 'rf1';
      const filter: UpdateFilterEvent = {
        reference: {
          relatedRel: 'comp1',
          val: 'some val',
          relation: CustomComponentRefRelation.filterOn,
        },
        value: { comp1: 'some value' },
      };
      relation.applyFilter(dependentComponentId, filter);
      expect(relation.filters[dependentComponentId]).toEqual(filter);
    });
  });

  describe('clearFilter()', () => {
    it('should clear filter for passed dependent component', () => {
      const dependentComponentId = 'rf1';
      relation.filters[dependentComponentId] = {
        reference: {
          relatedRel: 'comp1',
          val: 'some val',
          relation: CustomComponentRefRelation.filterOn,
        },
        value: { comp1: 'some value' },
      };
      relation.clearFilter(dependentComponentId);
      expect(relation.filters[dependentComponentId]).toBeNull();
    });
  });

  describe('filters$ property', () => {
    it('should be observable', (done) => {
      relation.filters$.subscribe((result) => {
        expect(result).toEqual({});
        done();
      });
      expect(relation.filters$).toBeInstanceOf(Observable);
    });

    it('should be emitted if set filters property', (done) => {
      const filters: UpdateFiltersEvents = {
        a: null,
      };

      relation.filters = filters;

      relation.filters$.subscribe((result) => {
        expect(result).toBe(filters);
        done();
      });
    });
  });

  describe('filters property', () => {
    it('should be {} by default', () => {
      expect(relation.filters).toEqual({});
    });
  });
});
