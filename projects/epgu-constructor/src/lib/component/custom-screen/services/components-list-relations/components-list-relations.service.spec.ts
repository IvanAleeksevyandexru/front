import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfigService, DatesToolsService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import {
  CustomComponent,
  CustomComponentRef,
  CustomListDictionaries,
  CustomListStatusElements,
  CustomScreenComponentTypes,
  CustomStatusElement,
  DATE_RESTRICTION_GROUP_DEFAULT_KEY,
  DateRestriction,
} from '../../components-list.types';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { RefRelationService } from '../../../../shared/services/ref-relation/ref-relation.service';
import { ComponentsListRelationsService } from './components-list-relations.service';
import { Observable } from 'rxjs';
import { ComponentDictionaryFilters } from './components-list-relations.interface';
import { isArray as _isArray, mergeWith as _mergeWith } from 'lodash';
import { calcRefMock } from '../../../../shared/services/ref-relation/ref-relation.mock';
import { configureTestSuite } from 'ng-bullet';
import {
  CustomComponentRefRelation,
  DictionaryConditions,
  DictionaryFilters,
  DictionaryValueTypes,
} from '@epgu/epgu-constructor-types';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';
import { MockProvider } from 'ng-mocks';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { DateRefService } from '../../../../core/services/date-ref/date-ref.service';

describe('ComponentsListRelationsService', () => {
  let service: ComponentsListRelationsService;
  let componentMock: CustomComponent = {
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
  const componentsMock: CustomComponent[] = [componentMock];
  const createComponentMock = (
    mergedData: unknown = {},
    component: CustomComponent = componentMock,
  ): CustomComponent => {
    return _mergeWith({}, component, mergedData, (objValue, srcValue) => {
      if (_isArray(objValue)) {
        return srcValue;
      }
    });
  };

  let screenService: ScreenService;
  let dictionaryToolsService: DictionaryToolsService;
  let refRelationService: RefRelationService;
  let dateRangeService: DateRangeService;
  let dateRestrictionsService: DateRestrictionsService;

  configureTestSuite(() => {
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
  });

  describe('filters$ property', () => {
    it('should be observable', (done) => {
      service.filters$.subscribe((result) => {
        expect(result).toEqual({});
        done();
      });
      expect(service.filters$).toBeInstanceOf(Observable);
    });

    it('should be emitted if set filters property', (done) => {
      const filters: ComponentDictionaryFilters = {
        a: null,
      };

      service.filters = filters;

      service.filters$.subscribe((result) => {
        expect(result).toBe(filters);
        done();
      });
    });
  });

  describe('filters property', () => {
    it('should be {} by default', () => {
      expect(service.filters).toEqual({});
    });
  });

  describe('getUpdatedShownElements()', () => {
    const shownElements: CustomListStatusElements = {
      foo: {
        isShown: true,
        relation: CustomComponentRefRelation.autofillFromDictionary,
      },
    };
    const form: FormArray = new FormArray([]);
    const dictionaries: CustomListDictionaries = [];

    it('should do nothing if there is no dependent components', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate');
      jest.spyOn<any, any>(service, 'getDependentComponentUpdatedShownElements');

      let result = service.getUpdatedShownElements(
        [],
        createComponentMock({
          id: 'compId',
        }),
        shownElements,
        form,
        dictionaries,
        false,
        screenService,
        dictionaryToolsService,
      );

      // ничего не делаем, потому что массив components пустой (функция возвращает shownElements без изменений)
      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(service['getDependentComponentUpdatedShownElements']).not.toBeCalled();
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
        dictionaries,
        false,
        screenService,
        dictionaryToolsService,
      );

      // ничего не делаем, потому что массив components не содержит ни одного компонента, который ссылается на component.
      // (component.id (compId) !== attrs.ref[0].relatedRel (rf1) )
      // (функция возвращает shownElements без изменений)
      expect(dateRangeService.updateLimitDate).not.toBeCalled();
      expect(service['getDependentComponentUpdatedShownElements']).not.toBeCalled();
      expect(result).toEqual({
        foo: {
          isShown: true,
          relation: CustomComponentRefRelation.autofillFromDictionary,
        },
      });
    });

    it('should update shown elements for dependent components if el.relatedRel === component.id', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate').mockImplementation(() => undefined);
      jest.spyOn<any, any>(service, 'getDependentComponentUpdatedShownElements').mockReturnValue({
        bar: {
          isShown: false,
          relation: CustomComponentRefRelation.calc,
        },
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
        dictionaries,
        initInitialValues,
        screenService,
        dictionaryToolsService,
      );

      expect(service['getDependentComponentUpdatedShownElements']).toBeCalledTimes(1);
      expect(result).toEqual({
        bar: {
          isShown: false,
          relation: CustomComponentRefRelation.calc,
        },
      });
    });

    it('should update limit date of dependent components if el.relatedDate === component.id', () => {
      jest.spyOn(dateRangeService, 'updateLimitDate').mockImplementation(() => undefined);
      jest.spyOn<any, any>(service, 'getDependentComponentUpdatedShownElements').mockReturnValue({
        bar: {
          isShown: false,
          relation: CustomComponentRefRelation.calc,
        },
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
        dictionaries,
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
      jest.spyOn<any, any>(service, 'getDependentComponentUpdatedShownElements');
      jest.spyOn<any, any>(service, 'getDependentComponents').mockReturnValue(components);

      let result = service.getUpdatedShownElements(
        components,
        createComponentMock({
          id: 'compId',
        }),
        shownElements,
        form,
        dictionaries,
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

  describe('getDependentComponentUpdatedShownElements()', () => {
    let dependentComponent: CustomComponent;
    let components: CustomComponent[];
    let dependentComponentStatus: CustomStatusElement;
    let shownElements: CustomListStatusElements;
    let dependentControl: AbstractControl;
    let form: FormArray;
    let dictionaries: CustomListDictionaries;
    let initInitialValues;
    let componentVal;

    beforeEach(() => {
      dependentComponent = createComponentMock({
        id: 'dependentComponentId',
      });
      components = [createComponentMock()];
      dependentComponentStatus = {
        isShown: true,
        relation: CustomComponentRefRelation.autofillFromDictionary,
      };
      shownElements = {
        dependentComponentId: dependentComponentStatus,
      };
      componentVal = { foo: 'bar' };
      dependentControl = new FormControl({
        id: 'dependentComponentId',
      });
      form = new FormArray([dependentControl]);
      initInitialValues = false;
      dictionaries = [];
    });

    describe('if relation === displayOff', () => {
      it('should update shownElements and mark as untouched if NOT isDisplayOn OR element.isShown === TRUE', () => {
        let updatedShownElements: CustomListStatusElements;

        dependentControl.markAsTouched();

        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.displayOff,
        };

        updatedShownElements = service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          {
            [dependentComponent.id]: {
              isShown: false,
              relation: CustomComponentRefRelation.displayOn,
            },
          },
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // потому что isShown === false AND isDisplayOn
        expect(dependentControl.touched).toBeTruthy();
        expect(updatedShownElements).toEqual({
          [dependentComponent.id]: {
            isShown: false,
            relation: CustomComponentRefRelation.displayOn,
          },
        });

        updatedShownElements = service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          {
            [dependentComponent.id]: {
              isShown: true,
              relation: CustomComponentRefRelation.displayOn,
            },
          },
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // потому что isShown === true
        expect(dependentControl.touched).toBeFalsy();
        expect(updatedShownElements).toEqual({
          [dependentComponent.id]: {
            isShown: true,
            relation: CustomComponentRefRelation.displayOff,
          },
        });

        dependentControl.markAsTouched();

        updatedShownElements = service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          {
            [dependentComponent.id]: {
              isShown: false,
              relation: CustomComponentRefRelation.getValue,
            },
          },
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // потому что NOT isDisplayOn
        expect(dependentControl.touched).toBeFalsy();
        expect(updatedShownElements).toEqual({
          [dependentComponent.id]: {
            isShown: true,
            relation: CustomComponentRefRelation.displayOff,
          },
        });
      });
    });

    describe('if relation === displayOn', () => {
      it('should update shownElements and mark as untouched if NOT isDisplayOff OR element.isShown === TRUE', () => {
        let updatedShownElements: CustomListStatusElements;

        dependentControl.markAsTouched();

        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.displayOn,
        };

        updatedShownElements = service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          {
            [dependentComponent.id]: {
              isShown: false,
              relation: CustomComponentRefRelation.displayOff,
            },
          },
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // потому что isShown === false AND isDisplayOff
        expect(dependentControl.touched).toBeTruthy();
        expect(updatedShownElements).toEqual({
          [dependentComponent.id]: {
            isShown: false,
            relation: CustomComponentRefRelation.displayOff,
          },
        });

        updatedShownElements = service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          {
            [dependentComponent.id]: {
              isShown: true,
              relation: CustomComponentRefRelation.displayOff,
            },
          },
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // потому что isShown === true
        expect(dependentControl.touched).toBeFalsy();
        expect(updatedShownElements).toEqual({
          [dependentComponent.id]: {
            isShown: false,
            relation: CustomComponentRefRelation.displayOn,
          },
        });

        dependentControl.markAsTouched();
        updatedShownElements = service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          {
            [dependentComponent.id]: {
              isShown: false,
              relation: CustomComponentRefRelation.getValue,
            },
          },
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // потому что NOT isDisplayOff
        expect(dependentControl.touched).toBeFalsy();
        expect(updatedShownElements).toEqual({
          [dependentComponent.id]: {
            isShown: false,
            relation: CustomComponentRefRelation.displayOn,
          },
        });
      });
    });

    describe('if relation === getValue', () => {
      it('should patch dependentControl value', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.getValue,
        };

        dependentComponent = createComponentMock({
          attrs: {
            ref: [
              {
                relatedRel: 'rf2',
                val: 'some value',
                relation: CustomComponentRefRelation.getValue,
                sourceId: 'someSourceId',
              },
            ],
          },
        });

        components = [
          createComponentMock({
            id: 'someSourceId',
          }),
        ];

        componentVal = 'some value';

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormGroup({
            firstControl: new FormControl('first value'),
            secondControl: new FormControl('second value'),
          }),
        });

        form = new FormArray([dependentControl]);

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        expect(dependentControl.get('value').value).toEqual({
          firstControl: 'first value',
          secondControl: 'second value',
        });
      });
    });

    describe('if relation === autofillFromDictionary', () => {
      it('should update dependent control if initInitialValues is TRUE', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.autofillFromDictionary,
        };

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('some value'),
        });
        form = new FormArray([dependentControl]);

        dependentControl.markAsTouched();
        initInitialValues = false;

        componentVal = {
          id: 'foo',
          regOkato: '450000',
        };

        // почему-то ожидается, что dictionaries - это объект, а не массив.
        // Несмотря на то, что это тип CustomListDictionaries
        // (type CustomListDictionaries = Array<{ [key: string]: CustomListDictionary[] }>;)
        dictionaries = {} as CustomListDictionaries;

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // dependentControl не изменился, потому что initInitialValues === FALSE
        expect(dependentControl.touched).toBeTruthy();
        expect(dependentControl.get('value').value).toBe('some value');

        initInitialValues = true;
        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // dependentControl изменился, потому что initInitialValues === TRUE
        // value === '', потому что в dictinaries нет нужного словаря
        expect(dependentControl.touched).toBeFalsy();
        expect(dependentControl.get('value').value).toBe(null);

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('some value'),
        });
        form = new FormArray([dependentControl]);
        dependentControl.markAsTouched();
        dictionaries = ({
          rf1: {
            list: [
              {
                id: 'foo',
                originalItem: {
                  attributeValues: {
                    [reference.val as string]: 'some attribute value',
                  },
                },
              },
            ],
          },
        } as unknown) as CustomListDictionaries;

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // dependentControl изменился, потому что initInitialValues === TRUE
        // value === 'some value', потому что в dictionaries есть нужный словарь
        expect(dependentControl.touched).toBeFalsy();
        expect(dependentControl.get('value').value).toBe('some value');
      });

      it('should update dependent control if it is equal empty string', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.autofillFromDictionary,
        };

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl(''),
        });
        form = new FormArray([dependentControl]);

        dependentControl.markAsTouched();
        initInitialValues = false;

        componentVal = {
          id: 'foo',
          regOkato: '450000',
        };

        dictionaries = {} as CustomListDictionaries;

        initInitialValues = true;
        jest.spyOn(service, 'getDictionaryAttributeValue').mockReturnValue('new value');

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        expect(dependentControl.touched).toBeFalsy();
        expect(dependentControl.get('value').value).toBe('new value');
      });
    });

    describe('if relation === calc', () => {
      it('should update dependent control', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.calc,
        };

        dependentComponent = createComponentMock({
          attrs: {
            ref: [
              {
                relatedRel: 'rf1',
                val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
                relation: CustomComponentRefRelation.displayOn,
              },
            ],
          },
        });

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl(''),
        });
        form = new FormArray([dependentControl]);

        jest.spyOn(service, 'getCalcValueFromRelation').mockReturnValue('some value');

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        expect(dependentControl.get('value').value).toBe('some value');
      });
    });

    describe('if relation === disabled', () => {
      it('should do nothing if isValueEquals() === TRUE AND component is disabled', () => {
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);

        let reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.disabled,
        };

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('a'),
        });
        dependentControl.disable();
        form = new FormArray([dependentControl]);
        dependentControl.markAsTouched();

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        expect(dependentControl.get('value').value).toBe('a');
        expect(dependentControl.touched).toBeTruthy();
        expect(dependentControl.enabled).toBeFalsy();
      });

      it('should patchValueAndDisable if isValueEquals() === TRUE and control is enabled', () => {
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);

        let reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.disabled,
        };

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('a'),
        });
        form = new FormArray([dependentControl]);
        dependentControl.markAsTouched();

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // если в reference нет defaultValue, то контролу устанавливается ""
        expect(dependentControl.get('value').value).toBe('');
        expect(dependentControl.touched).toBeFalsy();
        expect(dependentControl.enabled).toBeFalsy();

        reference = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.disabled,
          defaultValue: 'some default value',
        };

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('a'),
        });
        form = new FormArray([dependentControl]);
        dependentControl.markAsTouched();

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // контролу устанавливается значение reference.defaultValue
        expect(dependentControl.get('value').value).toBe('some default value');
        expect(dependentControl.touched).toBeFalsy();
        expect(dependentControl.enabled).toBeFalsy();
      });

      it('should patchValueAndEnable if isValueEquals() === FALSE AND component does not have any disabled refs with same value', () => {
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);

        let reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.disabled,
        };

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('a'),
        });
        form = new FormArray([dependentControl]);

        dependentComponent = createComponentMock({
          id: 'dependentComponentId',
          attrs: {
            ref: [
              {
                relatedRel: dependentComponent.id,
                val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
                relation: CustomComponentRefRelation.disabled,
              },
            ],
          },
        });

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        expect(dependentControl.enabled).toBeTruthy();

        // значение контрола не изменилось, т.к. в кэше сервиса (this.prevValues) нет значения для компонента
        expect(dependentControl.get('value').value).toBe('a');

        // делаем это для того, чтобы в кэше сервиса (this.prevValues) сохранилось значение для компонента
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('b'),
        });
        dependentControl.disable();
        form = new FormArray([dependentControl]);

        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);
        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // значение контрола изменилось, т.к. в кэше сервиса (this.prevValues) есть значение для компонента
        expect(dependentControl.get('value').value).toBe('a');
        expect(dependentControl.enabled).toBeTruthy();
      });

      it('should do nothing if isValueEquals() === FALSE AND component has any disabled refs with same value', () => {
        // делаем это для того, чтобы в кэше сервиса (this.prevValues) сохранилось значение для компонента
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);

        let reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.disabled,
        };

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('a'),
        });
        form = new FormArray([dependentControl]);

        dependentComponent = createComponentMock({
          id: 'dependentComponentId',
          attrs: {
            ref: [
              {
                relatedRel: dependentComponent.id,
                val: 'any value',
                relation: CustomComponentRefRelation.filterOn,
              },
              {
                relatedRel: dependentComponent.id,
                val: 'b',
                relation: CustomComponentRefRelation.disabled,
              },
            ],
          },
        });

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          value: new FormControl('b'),
        });
        dependentControl.disable();
        form = new FormArray([dependentControl]);

        // эта функция будет вызываться 2 раза, первый раз должна вернуть FALSE, второй раз она используется в приватной функции
        // componentHasAnyDisabledRefsWithSameValue() и должна вернуть TRUE, поэтому вместо mockReturnValue сделал mockImplementation
        jest
          .spyOn(refRelationService, 'isValueEquals')
          .mockImplementation((a: unknown, b: unknown) => a === b);
        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        expect(dependentControl.get('value').value).toBe('b');
        expect(dependentControl.enabled).toBeFalsy();
      });
    });

    describe('if relation === filterOn', () => {
      it('should apply filter if isValueEquals() AND isDictionaryLike()', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
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

        const resultFilter = {
          simple: {
            attributeName: 'okato',
            condition: 'EQUALS',
            value: {
              asString: componentVal.regOkato,
            },
          },
        };

        jest.spyOn(service, 'applyFilter').mockImplementation(() => undefined);
        jest.spyOn(service, 'clearFilter').mockImplementation(() => undefined);

        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
        jest.spyOn(dictionaryToolsService, 'isDictionaryLike').mockReturnValue(true);

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // вызывается applyFilter(), потому что isValueEquals() === TRUE AND isDictionaryLike() === TRUE
        expect(service.clearFilter).not.toBeCalled();
        expect(service.applyFilter).toBeCalledTimes(1);
        expect(service.applyFilter).toBeCalledWith(dependentComponent.id, resultFilter);
      });

      it('should apply filter if isValueEquals() AND isDictionaryLike()', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
          relation: CustomComponentRefRelation.filterOn,
        };

        jest.spyOn(service, 'applyFilter').mockImplementation(() => undefined);
        jest.spyOn(service, 'clearFilter').mockImplementation(() => undefined);

        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(true);
        jest.spyOn(dictionaryToolsService, 'isDictionaryLike').mockReturnValue(false);

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // вызывается clearFilter(), потому что isDictionaryLike() === FALSE
        expect(service.applyFilter).not.toBeCalled();
        expect(service.clearFilter).toBeCalledTimes(1);
        expect(service.clearFilter).toBeCalledWith(dependentComponent.id);

        (service.clearFilter as jest.Mock).mockClear();
        jest.spyOn(refRelationService, 'isValueEquals').mockReturnValue(false);
        jest.spyOn(dictionaryToolsService, 'isDictionaryLike').mockReturnValue(true);

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        // вызывается clearFilter(), потому что isValueEquals() === FALSE
        expect(service.applyFilter).not.toBeCalled();
        expect(service.clearFilter).toBeCalledTimes(1);
        expect(service.clearFilter).toBeCalledWith(dependentComponent.id);
      });
    });

    describe('if relation === autoFillTextFromRefs', () => {
      it('should patch dependentControl value', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf2',
          relation: CustomComponentRefRelation.autoFillTextFromRefs,
          relatedRelValues: {
            reference_to_name: 'title',
            reference_to_address: 'address',
          },
          val: '',
        };

        componentVal = { title: 'some title', address: 'some address' };

        dependentComponent = createComponentMock({
          id: 'rf2',
          label: 'label with ${reference_to_name}',
          clarification: 'clarification with ${reference_to_address}',
          hint: 'not match for replace ${not_match}',
        });

        dependentControl = new FormGroup({
          id: new FormControl(dependentComponent.id),
          label: new FormControl(dependentComponent.label),
          clarification: new FormControl((dependentComponent as any).clarification),
          hint: new FormControl(dependentComponent.hint),
        });

        service['handleAutoFillTextFromRefs'](
          reference,
          componentVal,
          dependentControl,
          dependentComponent,
        );

        expect(dependentControl.value).toEqual({
          id: 'rf2',
          label: 'label with some title',
          clarification: 'clarification with some address',
          hint: 'not match for replace ${not_match}',
        });
      });
    });

    describe('if relation === formatOn', () => {
      it('should set value from related component', () => {
        const reference: CustomComponentRef = {
          relatedRel: 'rf1',
          val: '*',
          relation: CustomComponentRefRelation.formatOn,
        };

        const dependentControl = form.controls[0];
        const patchValue = jest.spyOn(dependentControl, 'patchValue');

        service['getDependentComponentUpdatedShownElements'](
          dependentComponent,
          reference,
          componentVal,
          components,
          form,
          shownElements,
          dictionaries,
          initInitialValues,
          dictionaryToolsService,
          screenService,
        );

        expect(patchValue).toBeCalled();
        expect(patchValue).toBeCalledTimes(1);
        expect(patchValue).toBeCalledWith(
          {
            id: 'dependentComponentId',
            value: { rf1: { foo: 'bar' }},
          },
          {
            emitEvent: false,
            onlySelf: true,
          },
        );
      });
    });
  });

  describe('hasRelation()', () => {
    const cachedAnswers = {
      rf1: {
        visited: true,
        value: 'fake data',
      },
    };
    it('should return true, if component has identic relation', () => {
      expect(service.isComponentShown(componentMock, cachedAnswers)).toBe(true);
    });
    it('should return false, if component has no identic relation', () => {
      const component = { ...componentMock, attrs: { ref: [] }};
      expect(service.isComponentShown(component, cachedAnswers)).toBe(false);
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

  describe('getDictionaryAttributeValue()', () => {
    it('should return attribute value', () => {
      const dictionaryAttributeName = 'someAttributeName';

      const componentId = 'comp1';

      const components = [
        createComponentMock({
          id: 'comp1',
        }),
        createComponentMock({
          id: 'comp2',
        }),
      ];

      const componentVal = { id: 'foo' };

      let dictionaries = {} as CustomListDictionaries;

      // undefined потому что в словаре нет нет значения для компонента comp1
      expect(
        service.getDictionaryAttributeValue(
          dictionaryAttributeName,
          componentId,
          components,
          componentVal,
          dictionaries,
        ),
      ).toBeUndefined();

      dictionaries = ({
        comp1: {
          list: [
            {
              id: 'foo',
              originalItem: {
                attributeValues: {
                  someAttributeName: 'some attribute value',
                },
              },
            },
          ],
        },
      } as unknown) as CustomListDictionaries;

      expect(
        service.getDictionaryAttributeValue(
          dictionaryAttributeName,
          componentId,
          components,
          componentVal,
          dictionaries,
        ),
      ).toBe('some attribute value');
    });
  });

  describe('getRelation()', () => {
    it('should return reference relation found by component relation', () => {
      const component = componentMock;
      const reference = {
        relatedRel: 'rf1',
        val: '0c5b2444-70a0-4932-980c-b4dc0d3f02b5',
        relation: CustomComponentRefRelation.displayOn,
      };
      expect(service.getRelation(component, reference)).toEqual(reference);
    });
  });

  describe('getCalcFieldValue()', () => {
    it('should return number calculated from passed string formula', () => {
      expect(service.getCalcFieldValue('(50 + 150) / 100')).toBe(2);
    });
  });

  describe('getCalcValueFromRelation()', () => {
    const component = createComponentMock({
      value: '4',
    });
    const components = [component];
    let formMock: FormArray;

    it('should return empty string, if not all components have valid values', () => {
      formMock = new FormArray([]);
      expect(service.getCalcValueFromRelation(calcRefMock, components, formMock)).toBe('');
    });
    it('should return number calculated by formula, if components have valid values', () => {
      const form = new FormBuilder().group({ ...component });
      formMock = new FormArray([form]);
      expect(service.getCalcValueFromRelation(calcRefMock, components, formMock)).toBe('2');
    });
  });

  describe('applyFilter()', () => {
    it('should apply passed filter for dependent component', () => {
      const dependentComponentId = componentMock.id;
      // eslint-disable-next-line max-len
      const filter: DictionaryFilters['filter'] = {
        pageNum: 0,
        simple: {
          value: { asString: 'value' },
          condition: DictionaryConditions.CONTAINS,
          attributeName: 'value',
        },
      };
      service.applyFilter(dependentComponentId, filter);
      expect(service.filters[dependentComponentId]).toEqual(filter);
    });
  });

  describe('clearFilter()', () => {
    it('should clear filter for passped dependent component', () => {
      const dependentComponentId = componentMock.id;
      service.filters[dependentComponentId] = { pageNum: 0 };
      service.clearFilter(dependentComponentId);
      expect(service.filters[dependentComponentId]).toBeNull();
    });
  });

  describe('handleResetControl()', () => {
    const relatedComponent = {
      id: 'acc_org',
      type: 'CheckingAccount',
      required: true,
      label: 'Расчётный счёт',
      attrs: {
        refs: {},
        ref: [{ relatedRel: 'rf1', val: '', relation: 'reset' }],
      },
      value: '',
      visited: false,
    };
    const reference = { relatedRel: 'rf1', val: '', relation: 'reset' };
    it('should reset dependent control', () => {
      const fb = new FormBuilder();
      const form = fb.group({ ...componentMock });
      const form2 = fb.group({ ...relatedComponent });
      const mockForm = new FormArray([form, form2]);
      const control = mockForm.controls[1];
      service['handleResetControl'](control, mockForm, reference as any);
      expect(control.value.value).toBeNull();
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
      const dependentComponent = {
        id: 'acc_org',
        type: 'Lookup',
        required: true,
        label: 'Расчётный счёт',
        attrs: {
          ref: references ? [...references] : [],
        },
        value: '',
        visited: false,
      };

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

      service.onAfterFilterOnRel(componentMock, mockForm, dictionaryToolsService);

      expect(dependentControlSpy).not.toBeCalled();
    });

    it('should reset dependent control', () => {
      const { dependentControl, control, mockForm, dependentComponent } = setup();
      const dependentControlSpy = jest.spyOn(dependentControl, 'disable');
      control.markAsTouched();

      dictionaryToolsService.initDictionary({
        component: dependentComponent as CustomComponent,
        data: {
          error: { code: 0, message: 'emptyDictionary' },
          fieldErrors: [],
          items: [],
          total: 0,
        },
      });

      service.onAfterFilterOnRel(
        dependentComponent as CustomComponent,
        mockForm,
        dictionaryToolsService,
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

      dictionaryToolsService.initDictionary({
        component: dependentComponent as CustomComponent,
        data: {
          error: { code: 0, message: 'emptyDictionary' },
          fieldErrors: [],
          items: [],
          total: 0,
        },
      });

      service.onAfterFilterOnRel(
        dependentComponent as CustomComponent,
        mockForm,
        dictionaryToolsService,
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
