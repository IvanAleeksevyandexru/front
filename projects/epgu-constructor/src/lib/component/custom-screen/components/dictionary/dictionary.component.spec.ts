import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { DictionaryComponent } from './dictionary.component';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import {
  BaseUiModule,
  ConfigService,
  DatesToolsService,
  LoggerService,
  UnsubscribeService,
} from '@epgu/epgu-constructor-ui-kit';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { By } from '@angular/platform-browser';
import { CustomListDictionary } from '../../components-list.types';

import { HttpClientModule } from '@angular/common/http';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import DictionaryModelAttrs from './DictionaryModelAttrs';
import DictionaryModel from './DictionaryModel';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { ComponentsListRelationsServiceStub } from '../../services/components-list-relations/components-list-relations.service.stub';
import { of } from 'rxjs';
import { defer } from 'lodash';

const mockComponent = {
  id: 'mockComponentID',
  attrs: new DictionaryModelAttrs({ dictionaryType: 'someDictionaryType' }),
  value: 'dictionaryValue',
  required: false,
};

describe('DictionaryComponent', () => {
  let component: DictionaryComponent;
  let fixture: ComponentFixture<DictionaryComponent>;
  let dictionaryToolsService: DictionaryToolsService;
  let formService: ComponentsListFormServiceStub;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [DictionaryComponent, MockComponent(ComponentItemComponent)],
      imports: [BaseUiModule, HttpClientModule],
      providers: [
        DictionaryToolsService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        MockProvider(DatesToolsService),
        JsonHelperService,
        MockProvider(UnsubscribeService),
        MockProvider(ConfigService),
        MockProvider(LoggerService),
      ],
    })
      .overrideComponent(DictionaryComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
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

    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      model: new FormControl(new DictionaryModel({ attrs: mockComponent.attrs } as any)),
      value: valueControl,
      required: new FormControl(mockComponent.required),
    });
    formService['_form'] = new FormArray([control]);

    fixture = TestBed.createComponent(DictionaryComponent);

    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('Component should be instance of Dictionary Component', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
    expect(debugEl.componentInstance.control).toBe(valueControl);
    expect(debugEl.componentInstance.component.id).toEqual(mockComponent.id);
    expect(debugEl.componentInstance.invalid).toBeFalsy();
    component.control.setErrors({
      someErrorKey: true,
    });
    fixture.detectChanges();
    expect(debugEl.componentInstance.invalid).toBeTruthy();
  });

  describe('lib-dropdown', () => {
    const selector = 'lib-dropdown';

    beforeEach(() => {
      component.model['_dictionary$'].next({
          list: [{ id: 1, text: 'some-text' }],
        } as unknown as CustomListDictionary);
    });

    it('Should render Lib DropDown', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
    });

    it('Should render Lib DropDown', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector)).componentInstance.disabled).toBeTruthy();
      component.model['_dictionary$'].next({
        list: [
          { id: 1, text: 'some-text' },
          { id: 2, text: 'some-text2' },
        ],
      } as unknown as CustomListDictionary);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector)).componentInstance.disabled).toBeFalsy();
    });

    it('Should set value if list length equal 1', () => {
      const mockItem = {
        id: 1,
        text: 'some-text',
      };

      component.model['_dictionary$'].next(mockItem as unknown as CustomListDictionary);
      fixture.detectChanges();
      defer(() => expect(formService['_form'].value[0].value).toEqual(mockItem));
    });
  });

  describe('loadReferenceData$', () => {
    it('should use filter from dictionaryOptions if there is no dictionaryFilter', () => {
      control.value.attrs = new DictionaryModelAttrs({
        dictionaryOptions: {
          parentRefItemValue: '00000000000',
          filter: {
            simple: {
              attributeName: 'Id_Mark',
              condition: 'EQUALS' as any,
              value: { asString: '123' },
            },
          },
          additionalParams: [],
          excludedParams: [],
        },
      });


      const res = component['prepareOptions']();

      expect(res).toEqual({
          ...control.value.attrs.dictionaryOptions,
          pageNum: 0
        }
      );
    });

    it('should use dictionaryFilter if it exists', () => {
      control.value.attrs = new DictionaryModelAttrs({
        dictionaryFilter: [
          {
            attributeName: 'ID',
            value: 'dogovor_number.value',
            valueType: 'ref',
            condition: 'EQUALS' as any,
          },
        ],
      });
      const dictionaryOptions = {
        filter: {
          simple: {
            attributeName: 'ID',
            condition: 'EQUALS',
            value: {
              asString: 'val',
            },
          },
        },
        pageNum: 0,
        additionalParams: [],
        excludedParams: [],
      };

      const screenStoreSpy = jest.spyOn(component['screenService'], 'getStore')
        .mockReturnValue(   { applicantAnswers: { dogovor_number: { value: 'val' }}} as any);

      const res = component['prepareOptions']();

      expect(res).toEqual(
        dictionaryOptions,
      );
    });

    it('should combine dictionaryFilter and params from dictionaryOptions', () => {
      control.value.attrs =  new DictionaryModelAttrs({
        dictionaryFilter: [
          {
            attributeName: 'ID',
            value: 'dogovor_number.value',
            valueType: 'ref',
            condition: 'EQUALS' as any,
          },
        ],
        dictionaryOptions: {
          parentRefItemValue: '00000000000',
          filter: {
            simple: {
              attributeName: 'Id_Mark',
              condition: 'EQUALS' as any,
              value: { asString: '123' },
            },
          },
          additionalParams: [],
          excludedParams: [],
        },
      });
      const dictionaryOptions = {
        parentRefItemValue: '00000000000',
        filter: {
          simple: {
            attributeName: 'ID',
            condition: 'EQUALS',
            value: {
              asString: 'val',
            },
          },
        },
        pageNum: 0,
        additionalParams: [],
        excludedParams: [],
      };



      const screenStoreSpy = jest.spyOn(component['screenService'], 'getStore')
        .mockReturnValue(   { applicantAnswers: { dogovor_number: { value: 'val' }}} as any);

      const res = component['prepareOptions']();

      expect(res).toEqual(
        dictionaryOptions,
      );
    });
  });
});
