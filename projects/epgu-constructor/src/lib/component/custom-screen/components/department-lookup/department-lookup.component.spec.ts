import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { MockComponents, MockModule, MockProviders } from 'ng-mocks';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { DatesToolsService, UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { DropDownDeptsModule } from '../../../../shared/components/drop-down-depts/drop-down-depts.module';
import { DepartmentLookupComponent } from './department-lookup.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { CustomComponent, CustomListDictionary, CustomScreenComponentTypes } from '../../components-list.types';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import DepartmentLookupModelAttrs from './DepartmentLookupModelAttrs';
import DepartmentLookupModel from './DepartmentLookupModel';
import { ComponentsListRelationsServiceStub } from '../../services/components-list-relations/components-list-relations.service.stub';
import { of } from 'rxjs';
import { DictionaryConditions, DictionaryOptions } from '@epgu/epgu-constructor-types';
import { ScreenStore } from '../../../../screen/screen.types';


const mockPatchedBase: CustomComponent = new DepartmentLookupModel({
  id: 'dict2',
  type: CustomScreenComponentTypes.DropDownDepts,
  label: 'Информационный центр',
  attrs: {
    dictionaryType: 'FNS_ZAGS_ORGANIZATION_AREA',
    lockedValue: true,
    repeatWithNoFilters: true,

    dictionaryFilter: [
      {
        attributeName: 'SHOW_ON_MAP',
        condition: DictionaryConditions.EQUALS,
        value: '{"asString":"true"}',
        valueType: 'value',
      },
      {
        attributeName: 'SOLEMN',
        condition: DictionaryConditions.EQUALS,
        value: '{"asString":"true"}',
        valueType: 'value',
      },
      {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'regCode',
        valueType: 'preset',
      },
      {
        attributeName: 'PR2',
        condition: DictionaryConditions.EQUALS,
        value: '{"asString":"true"}',
        valueType: 'value',
      },
    ],
    secondaryDictionaryFilter: [
      {
        attributeName: 'CODE',
        condition: DictionaryConditions.CONTAINS,
        value: 'regCode',
        valueType: 'preset',
      },
    ],
    ref: [],
    defaultIndex: 0,
  },
  value: '',
  required: false,
});


const patchedComponent = new DepartmentLookupModel({
  ...mockPatchedBase,
  arguments: {
    id: '["R7800000"]',
  },
  attrs: {
    ...mockPatchedBase.attrs,
    dictionaryFilters: [
      [
        {
          attributeName: 'SHOW_ON_MAP',
          condition: DictionaryConditions.EQUALS,
          value: '{"asString":"true"}',
          valueType: 'value',
        },
      ],
      [
        {
          attributeName: 'SOLEMN',
          condition: DictionaryConditions.EQUALS,
          value: '{"asString":"true"}',
          valueType: 'value',
        },
      ],
      [
        {
          attributeName: 'CODE',
          condition: DictionaryConditions.CONTAINS,
          value: 'regCode',
          valueType: 'preset',
        },
      ],
      [
        {
          attributeName: 'PR2',
          condition: DictionaryConditions.EQUALS,
          value: '{"asString":"true"}',
          valueType: 'value',
        },
      ],
    ],
  },
});


const getDictionary = (count = 0) => {
  const items = [];

  for (let i = 0; i < count; i += 1) {
    items.push({
      value: `R780000${i}`,
      title: `TITLE_FOR_R780000${i}`,
    });
  }

  return {
    error: { code: 0, message: 'operation completed' },
    fieldErrors: [],
    total: items.length,
    items,
  };
};
const screenStore: ScreenStore = {};
const mockComponent = {
  id: 'SomeId',
  attrs: new DepartmentLookupModelAttrs({ dictionaryType: 'someDictionaryType' }),
  value: 'some value',
  required: false,
};

describe('DepartmentLookupComponent', () => {
  let component: DepartmentLookupComponent;
  let fixture: ComponentFixture<DepartmentLookupComponent>;
  let dictionaryToolsService: DictionaryToolsService;
  let formService: ComponentsListFormServiceStub;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentLookupComponent, MockComponents(ComponentItemComponent)],
      imports: [MockModule(DropDownDeptsModule)],
      providers: [
        UnsubscribeService,
        DictionaryToolsService,
        JsonHelperService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        MockProviders(DatesToolsService, SuggestHandlerService),
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    })
      .overrideComponent(DepartmentLookupComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  let valueControl: FormControl;
  let control: FormGroup;

  beforeEach(() => {
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);

    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;

    valueControl = new FormControl(patchedComponent.value);

    control = new FormGroup({
      id: new FormControl(patchedComponent.id),
      attrs: new FormControl(patchedComponent.attrs),
      value: valueControl,
      required: new FormControl(patchedComponent.required),
      model: new FormControl(new DepartmentLookupModel({ attrs: patchedComponent.attrs } as any)),
    });

    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(DepartmentLookupComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';
    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.control).toBe(valueControl);
    expect(debugEl.componentInstance.component.id).toEqual(patchedComponent.id);
    expect(debugEl.componentInstance.invalid).toBeFalsy();

    component.control.setErrors({
      someErrorKey: true,
    });
    fixture.detectChanges();

    expect(debugEl.componentInstance.invalid).toBeTruthy();
  });

  describe('epgu-constructor-drop-down-depts', () => {
    const selector = 'epgu-constructor-drop-down-depts';

    beforeEach(() => {
      component.model['_dictionary$'].next(
       { id: 1, text: 'some-text' } as unknown as CustomListDictionary);
    });

    it('should be rendered if dropDowns is TRUTHY', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
    });

    it('invalid property is TRUE if value control is invalid and touched', () => {
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));
      const invalid = debugEl.componentInstance.invalid;

      expect(invalid).toBeFalsy();

      valueControl.setErrors({
        someErrorKey: true,
      });
      valueControl.markAsTouched();
      fixture.detectChanges();

      expect(invalid).toBeFalsy();
    });

    it('check input properties', () => {
      fixture.detectChanges();
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.component.id).toStrictEqual(patchedComponent.id);
      expect(debugEl.componentInstance.dictionary).toStrictEqual({ id: 1, text: 'some-text' });
      expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.TOUCHED_UNFOCUSED);
      expect(debugEl.componentInstance.control).toBe(valueControl);
      expect(debugEl.componentInstance.required).toBeFalsy();
      expect(debugEl.componentInstance.attrs).toBe(patchedComponent.attrs);
    });
  });

  describe('dictionaryFiltersLoader', () => {

    it('filter getDictionaries$', (done) => {
      const items = [
        {
          value: 'R7800001',
          title: 'TITLE_FOR_R7800001',
        },
        {
          value: 'R7800002',
          title: 'TITLE_FOR_R7800002',
        },
      ];
      jest.spyOn(dictionaryToolsService, 'getDictionaries$').mockReturnValue(
        of({
          component: patchedComponent,
          data: {
            error: { code: 0, message: 'operation completed' },
            fieldErrors: [],
            total: items.length,
            items,
          },
        } as any),
      );
      const { dictionaryType } = patchedComponent.attrs;
      const dictionaryOptions: DictionaryOptions = {
        pageNum: 0,
        additionalParams: [],
        excludedParams: [],
      };
      dictionaryToolsService
        .getDictionaries$(dictionaryType, patchedComponent, dictionaryOptions)
        .subscribe((response) => {
          expect(response).toEqual({
            component: patchedComponent,
            data: {
              error: { code: 0, message: 'operation completed' },
              fieldErrors: [],
              total: items.length,
              items,
            },
          });
          done();
        });
    });

    it('nulled items', (done) => {
      jest.spyOn(dictionaryToolsService, 'getDictionaries$').mockReturnValue(
        of({
          component: patchedComponent,
          data: getDictionary(0),
        } as any),
      );
      const { dictionaryType } = patchedComponent.attrs;
      component['dictionaryFiltersLoader'](
          patchedComponent as any,
          screenStore,
          dictionaryType,
          patchedComponent.attrs.dictionaryFilters,
        )
        .subscribe(() => {
          expect(dictionaryToolsService.getDictionaries$).toHaveBeenCalledTimes(4);
          done();
        });
    });
    it('not nulled items', (done) => {
      jest.spyOn(dictionaryToolsService, 'getDictionaries$').mockReturnValue(
        of({
          component: patchedComponent,
          data: getDictionary(1),
        } as any),
      );
      const { dictionaryType } = patchedComponent.attrs;

      component['dictionaryFiltersLoader'](
          patchedComponent as any,
          screenStore,
          dictionaryType,
          patchedComponent.attrs.dictionaryFilters,
        )
        .subscribe(() => {
          expect(dictionaryToolsService.getDictionaries$).toHaveBeenCalledTimes(1);
          done();
        });
    });
  });

  describe('getDropDownDepts$()', () => {
    it('should dictionaryFilters', (done) => {

     const spy = jest.spyOn(component, 'dictionaryFiltersLoader');

      component.loadReferenceData$().subscribe(() => {
        expect(spy).toHaveBeenCalled();
        done();
      });
    });

    describe('when repeatWithNoFilters is false and there is no items', () => {

      const data = {
        component: patchedComponent,
        data: getDictionary(0),
      };

      it('should NOT re-fetch data from nsi dictionary', fakeAsync(() => {
        jest.spyOn(dictionaryToolsService, 'getDictionaries$').mockReturnValue(of(data) as any);
        control.value.attrs['repeatWithNoFilters'] = false;
        control.value.attrs['dictionaryFilters'] = [];

        component.loadReferenceData$().subscribe((response) =>
          expect(response.repeatedWithNoFilters).toBeFalsy()
        );
        tick();
      }));
    });

    describe('when repeatWithNoFilters is true', () => {


      describe('when there is no items for filtered fetch', () => {
        const data = {
          component: patchedComponent,
          data: getDictionary(0),
        };

        it('should re-fetch data from nsi dictionary', fakeAsync(() => {
          control.value.attrs['repeatWithNoFilters'] = true;
          control.value.attrs['dictionaryFilters'] = [];
          jest.spyOn(dictionaryToolsService, 'getDictionaries$').mockReturnValue(of(data) as any);

          component.loadReferenceData$().subscribe((response) => {
              expect(response.repeatedWithNoFilters).toEqual(true);
              expect(response.list.length).toBe(0);
          }

          );
          tick();
        }));
      });

      describe('when there is at least one item for filtered fetch', () => {
        const data = {
          component: patchedComponent,
          data: getDictionary(1),
        };

        it('should re-fetch data from nsi dictionary', fakeAsync(() => {
          jest.spyOn(dictionaryToolsService, 'getDictionaries$').mockReturnValue(of(data) as any);

          component.loadReferenceData$().subscribe((response) =>
            expect(response.repeatedWithNoFilters).toBeFalsy()
          );
          tick();
        }));
      });
    });
  });

});
