import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ConfigService,
  DatesToolsService,
  LoggerService,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListStatusElements,
  CustomScreenComponentTypes,
  DATE_RESTRICTION_GROUP_DEFAULT_KEY,
  DateRestriction,
} from '../../components-list.types';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { ComponentsListRelationsService } from './components-list-relations.service';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { MockProvider } from 'ng-mocks';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';
import {
  componentMock,
  createComponentMock,
  createComponentMockWithRel,
  createComponentMockWithNoRel,
} from './components-list-relations.mock';
import { RelationResolverService } from './relation-resolver.service';

describe('ComponentsListRelationsService', () => {
  let service: ComponentsListRelationsService;

  const componentsMock: CustomComponent[] = [componentMock];
  let screenService: ScreenService;
  let refRelationService: RefRelationService;
  let dateRangeService: DateRangeService;
  let dateRestrictionsService: DateRestrictionsService;
  let relationResolverService: RelationResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DateRefService,
        ComponentsListRelationsService,
        DateRangeService,
        DatesToolsService,
        RefRelationService,
        HttpClient,
        HttpHandler,
        JsonHelperService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        DictionaryApiService,
        ConfigService,
        LoggerService,
        FormBuilder,
        MockProvider(DateRestrictionsService),
        MockProvider(RelationResolverService),
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ComponentsListRelationsService);
    screenService = TestBed.inject(ScreenService);
    refRelationService = TestBed.inject(RefRelationService);
    dateRangeService = TestBed.inject(DateRangeService);
    dateRestrictionsService = TestBed.inject(DateRestrictionsService);
    relationResolverService = TestBed.inject(RelationResolverService);
  });

  describe('processRelations()', () => {
    const shownElements: CustomListStatusElements = {};
    const form: FormArray = new FormArray([]);

    it('should do nothing if there is no dependent components', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate');
      const getStrategySpy = jest
        .spyOn<any, any>(relationResolverService, 'getStrategy')
        .mockReturnValue({
          handleRelation: jest.fn(),
          isAtLeastOneRelationFired: jest.fn().mockReturnValue(false),
        });
      const component = createComponentMock({
        id: 'compId',
      });

      let result = service.processRelations(
        [component],
        component,
        shownElements,
        form,
        false,
        screenService,
      );

      // ничего не делаем, потому что массив components пустой (функция возвращает shownElements без изменений)
      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(getStrategySpy).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ compId: { isShown: false } });

      result = service.processRelations(
        [
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
        ],
        createComponentMock({
          id: 'compId',
        }),
        shownElements,
        form,
        false,
        screenService,
      );

      // ничего не делаем, потому что массив components не содержит ни одного компонента, который ссылается на component.
      // (component.id (compId) !== attrs.ref[0].relatedRel (rf1) )
      // (функция возвращает shownElements без изменений)
      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(getStrategySpy).toHaveBeenCalledTimes(4);
      expect(result).toEqual({ rf1: { isShown: false } });
    });

    it('should update shown elements for dependent components if el.relatedRel === component.id', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate').mockReturnValue(undefined);
      const getStrategySpy = jest
        .spyOn<any, any>(relationResolverService, 'getStrategy')
        .mockReturnValue({
          handleRelation: jest.fn(),
          isAtLeastOneRelationFired: jest.fn().mockReturnValue(false),
        });

      const reference: CustomComponentRef = {
        relatedRel: 'rf1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      };

      const dependentComponent = createComponentMockWithRel('comp1', reference);
      const component = createComponentMock({ id: 'rf1' });

      const initInitialValues = false;

      const result = service.processRelations(
        [dependentComponent, component],
        component,
        shownElements,
        form,
        initInitialValues,
        screenService,
      );

      expect(getStrategySpy).toHaveBeenCalledTimes(6);
      expect(result).toEqual({ comp1: { isShown: false }, rf1: { isShown: false } });
    });

    it('should update limit date of dependent components if el.relatedDate === component.id', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate').mockImplementation(() => undefined);
      jest.spyOn<any, any>(relationResolverService, 'getStrategy').mockReturnValue({
        handleRelation: jest.fn().mockReturnValue({
          bar: {
            isShown: false,
            relation: CustomComponentRefRelation.calc,
          },
        }),
        isAtLeastOneRelationFired: jest.fn().mockReturnValue(false),
      });

      const dependentComponent = createComponentMock({
        attrs: {
          ref: [
            {
              relatedRel: 'rf1',
              val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
              relation: CustomComponentRefRelation.displayOn,
              relatedDate: 'rf1',
              period: 'years',
              condition: '>today',
            },
          ],
        },
      });

      const component = createComponentMock({
        id: 'rf1',
      });

      service.processRelations(
        [dependentComponent],
        component,
        shownElements,
        form,
        false,
        screenService,
      );

      expect(dateRangeService.updateLimitDate).toBeCalledTimes(1);
      expect(dateRangeService.updateLimitDate).toBeCalledWith(
        form,
        component,
        dependentComponent,
        null,
      );
    });

    it('should work properly if there is no relatedRel in ref', () => {
      const component = JSON.parse(JSON.stringify(componentMock));
      component.attrs.ref = [
        {
          relatedDate: 'ai15',
          val: '90',
          period: 'days',
          condition: '>=',
        },
      ];

      const components = [component];

      jest.spyOn(dateRangeService, 'updateLimitDate');
      jest.spyOn<any, any>(relationResolverService, 'getStrategy').mockReturnValue({
        handleRelation: jest.fn(),
        isAtLeastOneRelationFired: jest.fn().mockReturnValue(false),
      });
      jest.spyOn<any, any>(service, 'getDependentComponents').mockReturnValue(components);

      let result = service.processRelations(
        components,
        createComponentMock({
          id: 'compId',
        }),
        shownElements,
        form,
        false,
        screenService,
      );

      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(result).toEqual({ rf1: { isShown: true } });
    });
  });

  describe('calculateVisibility()', () => {
    const cachedAnswers = {
      rf1: {
        visited: true,
        value: 'fake data',
      },
    };

    const component = {
      ...componentMock,
      id: 'rf0',
      attrs: {
        ref: [
          {
            relatedRel: 'rf1',
            val: 'fake data',
            relation: 'displayOff',
          },
        ],
      },
    } as CustomComponent;

    const form: FormArray = new FormArray([new FormControl(component)]);

    beforeEach(() => {
      jest.spyOn<any, any>(relationResolverService, 'getStrategy').mockReturnValue({
        isAtLeastOneRelationFired: jest.fn().mockReturnValue(false),
      });
    });

    it('should return false, if component has identical relation', () => {
      expect(service.calculateVisibility([componentMock], cachedAnswers, form)).toStrictEqual({
        rf1: { isShown: false },
      });
    });

    it('should return true by default, if component has no identical relation', () => {
      const customComponent = { ...componentMock, attrs: { ref: [] } };
      expect(service.calculateVisibility([customComponent], cachedAnswers, form)).toStrictEqual({
        rf1: { isShown: true },
      });
    });

    it('should be hidden if related component is hidden', () => {
      const components = [
        { id: 'rf1', attrs: { ref: [{ relation: 'displayOn' }] } } as CustomComponent,
        component,
      ];

      expect(service.calculateVisibility(components, cachedAnswers, form)).toStrictEqual({
        rf0: { isShown: true },
        rf1: { isShown: false },
      });
    });

    it('should be shown if related component is shown', () => {
      const components = [{ id: 'rf1' } as CustomComponent, component];

      expect(service.calculateVisibility(components, cachedAnswers, form)).toStrictEqual({
        rf0: { isShown: true },
        rf1: { isShown: true },
      });
    });

    it('should be hidden if related component was on prev screen', () => {
      const components = [component];

      expect(service.calculateVisibility(components, cachedAnswers, form)).toStrictEqual({
        rf0: { isShown: true },
      });
    });

    it('should return status elements', () => {
      const customCachedAnswers = {
        rf1: {
          visited: true,
          value: 'fake data',
        },
      };
      const components = [
        createComponentMockWithRel('comp1', {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.displayOn,
        }),
        createComponentMockWithRel('comp2', {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.calc,
        }),
      ];

      const mockForm = new FormArray(components.map((comp) => new FormControl(comp)));

      expect(service.calculateVisibility(components, customCachedAnswers, mockForm)).toEqual({
        comp1: { isShown: false },
        comp2: { isShown: true },
      });
    });

    it('should return correct value depend of another components on form', () => {
      const components = [
        createComponentMockWithRel('comp1', {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.displayOn,
        }),
        createComponentMockWithRel('comp2', {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.displayOff,
        }),
        createComponentMockWithRel(
          'comp3',
          {
            relatedRel: 'rf1',
            val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
            relation: CustomComponentRefRelation.displayOn,
          },
          {
            relatedRel: 'rf1',
            val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
            relation: CustomComponentRefRelation.displayOff,
          },
        ),
      ];

      const mockForm = new FormArray(components.map((comp) => new FormControl(comp)));

      expect(service.calculateVisibility(components, {}, mockForm)).toEqual({
        comp1: { isShown: false },
        comp2: { isShown: true },
        comp3: { isShown: false },
      });
    });

    it('should update dependent control as untouched when visibility inited first time', () => {
      const relatedComponent = createComponentMockWithNoRel('comp1');
      const dependentComponent = createComponentMockWithRel('comp2', {
        relatedRel: 'comp1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOff,
      });
      const components = [relatedComponent, dependentComponent];
      const relatedControl = new FormControl(relatedComponent);
      const dependentControl = new FormControl(dependentComponent);
      const mockForm = new FormArray([relatedControl, dependentControl]);

      dependentControl.markAsTouched();

      service.calculateVisibility(components, {}, mockForm);

      expect(dependentControl.touched).toBeFalsy();
    });

    it('should update dependent control as untouched when visibility is changed', () => {
      const relatedComponent = createComponentMockWithNoRel('comp1');
      const dependentComponent = createComponentMockWithRel('comp2', {
        relatedRel: 'comp1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOff,
      });
      const components = [relatedComponent, dependentComponent];
      const relatedControl = new FormControl(relatedComponent);
      const dependentControl = new FormControl(dependentComponent);
      const mockForm = new FormArray([relatedControl, dependentControl]);

      const previousStatusElements = service.calculateVisibility(components, {}, mockForm);
      dependentControl.markAsTouched();

      previousStatusElements.comp2.isShown = !previousStatusElements.comp2.isShown;
      service.calculateVisibility(components, {}, mockForm, previousStatusElements);

      expect(dependentControl.touched).toBeFalsy();
    });

    it('should update dependent control as touched when visibility is not changed', () => {
      const relatedComponent = createComponentMockWithNoRel('comp1');
      const dependentComponent = createComponentMockWithRel('comp2', {
        relatedRel: 'comp1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOff,
      });
      const components = [relatedComponent, dependentComponent];
      const relatedControl = new FormControl(relatedComponent);
      const dependentControl = new FormControl(dependentComponent);
      const mockForm = new FormArray([relatedControl, dependentControl]);

      const previousStatusElements = service.calculateVisibility(components, {}, mockForm);
      dependentControl.markAsTouched();

      service.calculateVisibility(components, {}, mockForm, previousStatusElements);

      expect(dependentControl.touched).toBeTruthy();
    });

    it('should work even related element is after dependent element on form', () => {
      jest.spyOn<any, any>(relationResolverService, 'getStrategy').mockImplementation((refType) => {
        if (refType === CustomComponentRefRelation.displayOn) {
          return {
            isAtLeastOneRelationFired: jest
              .fn()
              .mockImplementation((_component, shownElements, _form, _cachedAnswers) => {
                return shownElements.comp1?.isShown || false;
              }),
          };
        }
        return { isAtLeastOneRelationFired: jest.fn().mockReturnValue(false) };
      });
      const relatedComponent = createComponentMockWithNoRel('comp1');
      const dependentComponent = createComponentMockWithRel('comp2', {
        relatedRel: 'comp1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      });
      const components = [dependentComponent, relatedComponent];
      const relatedControl = new FormControl(relatedComponent);
      const dependentControl = new FormControl(dependentComponent);
      const mockForm = new FormArray([relatedControl, dependentControl]);
      const shownElement = service.calculateVisibility(components, {}, mockForm);
      const previousStatusElements = service.calculateVisibility(
        components,
        {},
        mockForm,
        shownElement,
      );

      expect(previousStatusElements).toEqual({
        comp1: { isShown: true },
        comp2: { isShown: true },
      });
    });
  });

  describe('isComponentDependent()', () => {
    it('should return true, if component is dependent', () => {
      expect(service.isComponentDependent(componentMock.attrs.ref, componentMock)).toBe(true);
    });

    it('should return false, if component is not dependent', () => {
      const component = JSON.parse(JSON.stringify(componentMock));
      component.attrs.ref[0].relatedRel = 'pd4';
      expect(service.isComponentDependent(component.attrs.ref, componentMock)).toBe(false);
    });

    it('should work properly if there is no relatedRel attr in ref', () => {
      const component = JSON.parse(JSON.stringify(componentMock));
      component.attrs.ref = [
        {
          relatedDate: 'ai15',
          val: '90',
          period: 'days',
          condition: '>=',
        },
      ];

      expect(service.isComponentDependent(component.attrs.ref, componentMock)).toBe(false);
    });
  });

  describe('getDependentComponents()', () => {
    it('should return array of components with dependency', () => {
      expect(service.getDependentComponents(componentsMock, componentMock)).toEqual([
        componentMock,
      ]);
    });
  });

  describe('updateLimitDatesByDateRestrictions()', () => {
    it('should process date restrictions and pass right arguments to form update method', async () => {
      const dateRestrictions: DateRestriction[] = [
        { type: 'const', value: 'today', condition: '>' },
      ];
      const component: CustomComponent = {
        id: 'test',
        type: CustomScreenComponentTypes.DateInput,
        attrs: { dateRestrictions },
      };
      const form = new FormArray([]);
      const stub = jest.spyOn(service as any, 'updateFormWithDateRange').mockReturnValue(null);

      await service.updateLimitDatesByDateRestrictions([], component, form, {}, false);

      expect(stub).toHaveBeenLastCalledWith(
        form,
        component,
        undefined,
        DATE_RESTRICTION_GROUP_DEFAULT_KEY,
      );
    });

    it('should process date restrictions and separately call form update for different childs', async () => {
      const dateRestrictions: DateRestriction[] = [
        { type: 'const', value: 'today', condition: '>', forChild: 'first' },
        { type: 'const', value: 'today', condition: '>', forChild: 'second' },
      ];
      const component: CustomComponent = {
        id: 'test',
        type: CustomScreenComponentTypes.DateInput,
        attrs: { dateRestrictions },
      };
      const form = new FormArray([]);
      const stub = jest.spyOn(service as any, 'updateFormWithDateRange').mockReturnValue(null);

      await service.updateLimitDatesByDateRestrictions([], component, form, {}, false);

      expect(stub).toHaveBeenCalledTimes(2);
      expect(stub).nthCalledWith(1, form, component, undefined, 'first');
      expect(stub).nthCalledWith(2, form, component, undefined, 'second');
    });

    it('should correctly set min and max dates', async () => {
      const dateRestrictions: DateRestriction[] = [
        { type: 'const', value: 'today', condition: '>' },
      ];
      const component: CustomComponent = {
        id: 'test',
        type: CustomScreenComponentTypes.DateInput,
        attrs: {
          dateRestrictions,
        },
      };
      const control = new FormGroup({
        id: new FormControl('test'),
        attrs: new FormControl(component.attrs),
        value: new FormControl(''),
      });
      const form = new FormArray([control]);
      const testDate = new Date('2021-01-02T00:00:00.000Z');
      jest.spyOn(dateRestrictionsService, 'getDateRange').mockImplementation(() => {
        return Promise.resolve({
          min: testDate,
          max: testDate,
        });
      });

      await service.updateLimitDatesByDateRestrictions([], component, form, {}, false);

      expect(control.get('attrs').value.minDate).toEqual(testDate);
      expect(control.get('attrs').value.maxDate).toEqual(testDate);
    });

    it('should set min and max dates for child controls', async () => {
      const dateRestrictions: DateRestriction[] = [
        { type: 'const', value: 'today', condition: '>', forChild: 'firstDate' },
        { type: 'const', value: 'today', condition: '>', forChild: 'secondDate' },
      ];
      const component: CustomComponent = {
        id: 'test',
        type: CustomScreenComponentTypes.DateInput,
        attrs: {
          dateRestrictions,
          components: [
            { id: 'firstDate', attrs: {}, type: 'DateInput' },
            { id: 'secondDate', attrs: {}, type: 'DateInput' },
          ],
        },
      };
      const control = new FormGroup({
        id: new FormControl('test'),
        attrs: new FormControl(component.attrs),
        value: new FormControl(''),
      });
      const form = new FormArray([control]);
      const testDate = new Date('2021-01-02T00:00:00.000Z');
      jest.spyOn(dateRestrictionsService, 'getDateRange').mockImplementation(() => {
        return Promise.resolve({
          min: testDate,
          max: testDate,
        });
      });

      await service.updateLimitDatesByDateRestrictions([], component, form, {}, false);

      expect(control.get('attrs').value.components[0].attrs.minDate).toEqual(testDate);
      expect(control.get('attrs').value.components[1].attrs.minDate).toEqual(testDate);
      expect(control.get('attrs').value.components[0].attrs.maxDate).toEqual(testDate);
      expect(control.get('attrs').value.components[1].attrs.maxDate).toEqual(testDate);
    });
  });
});
