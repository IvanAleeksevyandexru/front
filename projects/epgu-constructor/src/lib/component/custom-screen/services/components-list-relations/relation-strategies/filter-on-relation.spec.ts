import { CustomComponent } from '../../../components-list.types';
import { CustomComponentRefRelation, DictionaryConditions, DictionaryValueTypes, } from '@epgu/epgu-constructor-types';
import { MockService } from 'ng-mocks';
import { RefRelationService } from '../../../../../shared/services/ref-relation/ref-relation.service';
import { FilterOnRelation } from './filter-on-relation';
import { DictionaryToolsService } from '../../../../../shared/services/dictionary/dictionary-tools.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { setupForRelationStrategy } from '../components-list-relations.mock';

describe('FilterOnRelation', () => {
  let relation: FilterOnRelation;
  let componentVal =  { foo: 'bar', regOkato: '123' };
  let components: CustomComponent[] = [];
  const dictionaryToolsService = MockService(DictionaryToolsService, {
    applyFilter: jest.fn().mockReturnValue(undefined),
    clearFilter: jest.fn().mockReturnValue(undefined),
    isDictionaryLike: jest.fn().mockReturnValue(true),
    getFilterOptions: jest.fn().mockReturnValue({
      filter: { simple: { attributeName: 'okato', condition: 'EQUALS', value: { asString: '123' }}},
    }),
  });
  const screenService = MockService(ScreenService);
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
    relation = new FilterOnRelation(refRelationService);

    (dictionaryToolsService.applyFilter as unknown as { mockReset: Function }).mockReset();
    (dictionaryToolsService.clearFilter as unknown as { mockReset: Function }).mockReset();
  });

  it('should apply filter if isValueEquals() AND isDictionaryLike()', () => {
    let {
      reference,
      dependentComponent,
      form,
      shownElements,
    } = setupForRelationStrategy({
      referenceExtra: {
        relation: CustomComponentRefRelation.filterOn,
        dictionaryFilter: [
          {
            attributeName: 'okato',
            condition: DictionaryConditions.EQUALS,
            value: 'regOkato',
            valueType: DictionaryValueTypes.preset,
          },
        ],
      },
    });

    const resultFilter = {
      simple: {
        attributeName: 'okato',
        condition: 'EQUALS',
        value: {
          asString: componentVal.regOkato,
        },
      },
    };

    const applyFilterSpy = jest.spyOn(dictionaryToolsService, 'applyFilter').mockImplementation(() => undefined);
    const clearFilterSpy = jest.spyOn(dictionaryToolsService, 'clearFilter').mockImplementation(() => undefined);

    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    jest.spyOn(dictionaryToolsService, 'isDictionaryLike').mockReturnValue(true);

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      false,
      dictionaryToolsService,
      screenService,
    );

    // вызывается applyFilter(), потому что isValueEquals() === TRUE AND isDictionaryLike() === TRUE
    expect(clearFilterSpy).not.toBeCalled();
    expect(applyFilterSpy).toBeCalledTimes(1);
    expect(applyFilterSpy).toBeCalledWith(dependentComponent.id, resultFilter);
  });

  it('should apply filter if isValueEquals() AND isDictionaryLike()', () => {
    let {
      reference,
      dependentComponent,
      form,
      shownElements,
    } = setupForRelationStrategy({
      referenceExtra: { relation: CustomComponentRefRelation.filterOn },
    });

    const applyFilterSpy = jest.spyOn(dictionaryToolsService, 'applyFilter').mockImplementation(() => undefined);
    const clearFilterSpy = jest.spyOn(dictionaryToolsService, 'clearFilter').mockImplementation(() => undefined);

    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
    jest.spyOn(dictionaryToolsService, 'isDictionaryLike').mockReturnValue(false);

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      false,
      dictionaryToolsService,
      screenService,
    );

    // вызывается clearFilter(), потому что isDictionaryLike() === FALSE
    expect(applyFilterSpy).not.toBeCalled();
    expect(clearFilterSpy).toBeCalledTimes(1);
    expect(clearFilterSpy).toBeCalledWith(dependentComponent.id);

    clearFilterSpy.mockClear();
    jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);
    jest.spyOn(dictionaryToolsService, 'isDictionaryLike').mockReturnValue(true);

    relation.handleRelation(
      shownElements,
      dependentComponent,
      reference,
      componentVal,
      form,
      components,
      false,
      dictionaryToolsService,
      screenService,
    );

    // вызывается clearFilter(), потому что isValueEquals() === FALSE
    expect(applyFilterSpy).not.toBeCalled();
    expect(clearFilterSpy).toBeCalledTimes(1);
    expect(clearFilterSpy).toBeCalledWith(dependentComponent.id);
  });
});
