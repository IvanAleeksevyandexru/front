import {
  CustomComponentRefRelation,
  DictionaryConditions,
  DictionaryValueTypes,
} from '@epgu/epgu-constructor-types';
import { MockProvider } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { FilterOnRelation } from './filter-on-relation';
import { setupForRelationStrategy } from '../components-list-relations.mock';
import { Observable } from 'rxjs';
import { UpdateFilterEvent, UpdateFiltersEvents } from '../components-list-relations.interface';
import { JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
import { TestBed } from '@angular/core/testing';

describe('FilterOnRelation', () => {
  let relation: FilterOnRelation;
  let componentVal = { foo: 'bar', regOkato: '123' };
  let refRelationService: RefRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilterOnRelation,
        MockProvider(RefRelationService),
        MockProvider(JsonHelperService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    relation = TestBed.inject(FilterOnRelation);
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
    let { reference, dependentComponent, form } = setupForRelationStrategy({
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

    relation.handleRelation(dependentComponent, reference, componentVal, form);

    // вызывается applyFilter(), потому что isValueEquals() === TRUE AND isDictionaryLike() === TRUE
    expect(clearFilterSpy).not.toBeCalled();
    expect(applyFilterSpy).toBeCalledTimes(1);
    expect(applyFilterSpy).toBeCalledWith(dependentComponent.id, resultFilter);
  });

  it('should apply filter if isValueEquals() AND isDictionaryLike()', () => {
    let { reference, dependentComponent, form } = setupForRelationStrategy({
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

    relation.handleRelation(dependentComponent, reference, componentVal, form);

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
      // @ts-ignore
      relation.applyFilter(dependentComponentId, filter);
      // @ts-ignore
      expect(relation.filters[dependentComponentId]).toEqual(filter);
    });
  });

  describe('clearFilter()', () => {
    it('should clear filter for passed dependent component', () => {
      const dependentComponentId = 'rf1';
      // @ts-ignore
      relation.filters[dependentComponentId] = {
        reference: {
          relatedRel: 'comp1',
          val: 'some val',
          relation: CustomComponentRefRelation.filterOn,
        },
        value: { comp1: 'some value' },
      };
      // @ts-ignore
      relation.clearFilter(dependentComponentId);
      // @ts-ignore
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

      // @ts-ignore
      relation.filters = filters;

      relation.filters$.subscribe((result) => {
        expect(result).toBe(filters);
        done();
      });
    });
  });

  describe('filters property', () => {
    it('should be {} by default', () => {
      // @ts-ignore
      expect(relation.filters).toEqual({});
    });
  });
});
