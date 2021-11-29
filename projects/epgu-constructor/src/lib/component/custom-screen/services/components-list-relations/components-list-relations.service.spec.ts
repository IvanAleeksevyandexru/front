import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfigService, DatesToolsService, LoggerService, JsonHelperService } from '@epgu/epgu-constructor-ui-kit';
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
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { ComponentsListRelationsService } from './components-list-relations.service';
import { CustomComponentRefRelation } from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { MockProvider } from 'ng-mocks';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';
import LookupInputModel from '../../components/lookup-input/LookupInputModel';
import BaseModel from '../../component-list-resolver/BaseModel';
import DictionarySharedAttrs from '../../component-list-resolver/DictionarySharedAttrs';
import { of } from 'rxjs';
import { componentMock, createComponentMock } from './components-list-relations.mock';
import { RelationResolverService } from './relation-resolver.service';

describe('ComponentsListRelationsService', () => {
  let service: ComponentsListRelationsService;

  const componentsMock: CustomComponent[] = [componentMock];
  let screenService: ScreenService;
  let dictionaryToolsService: DictionaryToolsService;
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
        DictionaryToolsService,
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
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);
    refRelationService = TestBed.inject(RefRelationService);
    dateRangeService = TestBed.inject(DateRangeService);
    dateRestrictionsService = TestBed.inject(DateRestrictionsService);
    relationResolverService = TestBed.inject(RelationResolverService);
  });

  describe('getUpdatedShownElements()', () => {
    const shownElements: CustomListStatusElements = {
      foo: {
        isShown: true,
        relation: CustomComponentRefRelation.autofillFromDictionary,
      },
    };
    const form: FormArray = new FormArray([]);

    it('should do nothing if there is no dependent components', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate');
      const getStrategySpy = jest.spyOn<any, any>(relationResolverService, 'getStrategy').mockReturnValue({
        handleRelation: jest.fn()
      });

      let result = service.getUpdatedShownElements(
        [],
        createComponentMock({
          id: 'compId',
        }),
        shownElements,
        form,
        false,
        screenService,
        dictionaryToolsService,
      );

      // ничего не делаем, потому что массив components пустой (функция возвращает shownElements без изменений)
      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(getStrategySpy).not.toBeCalled();
      expect(result).toEqual({
        foo: {
          isShown: true,
          relation: CustomComponentRefRelation.autofillFromDictionary,
        },
      });

      result = service.getUpdatedShownElements(
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
        dictionaryToolsService,
      );

      // ничего не делаем, потому что массив components не содержит ни одного компонента, который ссылается на component.
      // (component.id (compId) !== attrs.ref[0].relatedRel (rf1) )
      // (функция возвращает shownElements без изменений)
      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(getStrategySpy).not.toBeCalled();
      expect(result).toEqual({
        foo: {
          isShown: true,
          relation: CustomComponentRefRelation.autofillFromDictionary,
        },
      });
    });

    it('should update shown elements for dependent components if el.relatedRel === component.id', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate').mockImplementation(() => undefined);
      const getStrategySpy = jest.spyOn<any, any>(relationResolverService, 'getStrategy').mockReturnValue({
        handleRelation: jest.fn().mockReturnValue({
          bar: {
            isShown: false,
            relation: CustomComponentRefRelation.calc,
          },
        })
      });

      const reference: CustomComponentRef = {
        relatedRel: 'rf1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      };

      const dependentComponent = createComponentMock({
        attrs: {
          ref: [reference],
        },
      });

      const initInitialValues = false;

      const result = service.getUpdatedShownElements(
        [dependentComponent],
        createComponentMock({
          id: 'rf1',
        }),
        shownElements,
        form,
        initInitialValues,
        screenService,
        dictionaryToolsService,
      );

      expect(getStrategySpy).toBeCalledTimes(1);
      expect(result).toEqual({
        bar: {
          isShown: false,
          relation: CustomComponentRefRelation.calc,
        },
      });
    });

    it('should update limit date of dependent components if el.relatedDate === component.id', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate').mockImplementation(() => undefined);
      jest.spyOn<any, any>(relationResolverService, 'getStrategy').mockReturnValue({
        handleRelation: jest.fn().mockReturnValue({
          bar: {
            isShown: false,
            relation: CustomComponentRefRelation.calc,
          },
        })
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

      service.getUpdatedShownElements(
        [dependentComponent],
        component,
        shownElements,
        form,
        false,
        screenService,
        dictionaryToolsService,
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
        handleRelation: jest.fn()
      });
      jest.spyOn<any, any>(service, 'getDependentComponents').mockReturnValue(components);

      let result = service.getUpdatedShownElements(
        components,
        createComponentMock({
          id: 'compId',
        }),
        shownElements,
        form,
        false,
        screenService,
        dictionaryToolsService,
      );

      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(result).toEqual({
        foo: {
          isShown: true,
          relation: CustomComponentRefRelation.autofillFromDictionary,
        },
      });
    });
  });

  describe('createStatusElements()', () => {
    it('should return status elements', () => {
      const cachedAnswers = {
        rf1: {
          visited: true,
          value: 'fake data',
        },
      };
      const components = [
        createComponentMock({
          id: 'comp1',
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
        createComponentMock({
          id: 'comp2',
          attrs: {
            ref: [
              {
                relatedRel: 'rf1',
                val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
                relation: CustomComponentRefRelation.calc,
              },
            ],
          },
        }),
      ];

      expect(service.createStatusElements(components, cachedAnswers)).toEqual({
        comp1: {
          relation: CustomComponentRefRelation.displayOn,
          isShown: false,
        },
        comp2: {
          relation: CustomComponentRefRelation.displayOn,
          isShown: true,
        },
      });
    });

    it('should return relation displayOff if has displayOff refs only', () => {
      const components = [
        createComponentMock({
          id: 'comp1',
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
        createComponentMock({
          id: 'comp2',
          attrs: {
            ref: [
              {
                relatedRel: 'rf1',
                val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
                relation: CustomComponentRefRelation.displayOff,
              },
            ],
          },
        }),
        createComponentMock({
          id: 'comp3',
          attrs: {
            ref: [
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
            ],
          },
        }),
      ];

      expect(service.createStatusElements(components, {})).toEqual({
        comp1: {
          relation: CustomComponentRefRelation.displayOn,
          isShown: true,
        },
        comp2: {
          relation: CustomComponentRefRelation.displayOff,
          isShown: true,
        },
        comp3: {
          relation: CustomComponentRefRelation.displayOn,
          isShown: true,
        },
      });
    });
  });

  describe('isComponentShown()', () => {
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
            relation: 'displayOff'
          }
        ],
      },
    } as CustomComponent;

    it('should return false, if component has identical relation', () => {
      expect(service.isComponentShown(componentMock, cachedAnswers, [], {})).toBe(false);
    });

    it('should return true by default, if component has no identical relation', () => {
      const component = { ...componentMock, attrs: { ref: [] }};
      expect(service.isComponentShown(component, cachedAnswers, [],{})).toBe(true);
    });

    it('should be shown if related component is hidden', () => {
      const components = [{ id: 'rf1' } as CustomComponent, component];
      const componentListStatus = { rf1: { isShown: false }} as unknown as CustomListStatusElements;

      expect(service.isComponentShown(component, cachedAnswers, components, componentListStatus)).toBe(true);
    });

    it('should be hidden if related component is shown', () => {
      const components = [{ id: 'rf1' } as CustomComponent, component];
      const componentListStatus = { rf1: { isShown: true }} as unknown as CustomListStatusElements;

      expect(service.isComponentShown(component, cachedAnswers, components, componentListStatus)).toBe(false);
    });

    it('should be hidden if related component was on prev screen', () => {
      const components = [component];

      expect(service.isComponentShown(component, cachedAnswers, components, {})).toBe(false);
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

  describe('onAfterFilterOnRel()', () => {
    const setup = (
      references = [
        {
          relatedRel: componentMock.id,
          val: '*',
          relation: 'filterOn',
          dictionaryFilter: [],
        },
      ],
    ) => {
      const dependentComponent = new LookupInputModel({
        id: 'acc_org',
        type: 'Lookup',
        required: true,
        label: 'Расчётный счёт',
        attrs: {
          ref: references ? [...references] : [],
        },
        value: '',
        visited: false,
      } as unknown as BaseModel<DictionarySharedAttrs>);

      const fb = new FormBuilder();
      const mockForm = new FormArray([
        fb.group({ ...componentMock }),
        fb.group({ ...dependentComponent }),
      ]);
      const control = mockForm.controls[0];
      const dependentControl = mockForm.controls[1];

      return { control, dependentComponent, dependentControl, mockForm, references };
    };

    it('should do nothing when no ref', () => {
      const { dependentControl, mockForm } = setup(null);
      const dependentControlSpy = jest.spyOn(dependentControl, 'disable');

      service.onAfterFilterOnRel(componentMock as BaseModel<DictionarySharedAttrs>, mockForm);

      expect(dependentControlSpy).not.toBeCalled();
    });

    it('should reset dependent control', () => {
      const { dependentControl, control, mockForm, dependentComponent } = setup();
      const dependentControlSpy = jest.spyOn(dependentControl, 'disable');
      control.markAsTouched();
      dependentComponent.loadReferenceData$(of({
        component: dependentComponent as CustomComponent,
        data: {
          error: { code: 0, message: 'emptyDictionary' },
          fieldErrors: [],
          items: [],
          total: 0,
        },
      }));
      service.onAfterFilterOnRel(
        dependentComponent,
        mockForm,
      );

      expect(dependentControlSpy).toBeCalledWith({ emitEvent: false, onlySelf: true });
    });

    it('should NOT affect another relations', () => {
      const refs = [
        {
          relatedRel: componentMock.id,
          val: '',
          relation: 'displayOff',
        },
        {
          relatedRel: componentMock.id,
          val: '*',
          relation: 'filterOn',
          dictionaryFilter: [
            {
              attributeName: 'section',
              condition: 'EQUALS',
              value: 'id',
              valueType: 'preset',
            },
          ],
        },
      ];
      const refsExpected = JSON.parse(JSON.stringify(refs));
      const { dependentControl, control, mockForm, dependentComponent } = setup(refs as any);
      const dependentControlSpy = jest.spyOn(dependentControl, 'disable');
      control.markAsTouched();

      dependentComponent.loadReferenceData$(of({
        component: dependentComponent as CustomComponent,
        data: {
          error: { code: 0, message: 'emptyDictionary' },
          fieldErrors: [],
          items: [],
          total: 0,
        },
      }));

      service.onAfterFilterOnRel(
        dependentComponent,
        mockForm,
      );

      expect(dependentControlSpy).toBeCalledWith({ emitEvent: false, onlySelf: true });
      expect(dependentComponent.attrs.ref).toEqual(refsExpected);
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
      const stub = jest
        .spyOn(service as any, 'updateFormWithDateRange')
        .mockImplementation((...args) => null);

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
      const stub = jest
        .spyOn(service as any, 'updateFormWithDateRange')
        .mockImplementation((...args) => null);

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
      jest.spyOn(dateRestrictionsService, 'getDateRange').mockImplementation((...args) => {
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
      jest.spyOn(dateRestrictionsService, 'getDateRange').mockImplementation((...args) => {
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
