import { DropdownComponent } from './dropdown.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProviders } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import {
  BaseUiModule,
  DatesToolsService,
  EventBusService,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DropDownUpdateTypes } from './dropdown.interface';
import { HttpClientModule } from '@angular/common/http';
import DropdownModelAttrs from './DropdownModelAttrs';
import DropdownModel from './DropdownModel';

const mockComponentId = 'mockComponentID';

const mockComponent = {
  id: mockComponentId,
  attrs: new DropdownModelAttrs ({
    dictionaryType: 'someDropdownType',
    isNotDuplicate: false,
    dictionaryList: []
  }),
  value: 'dropdownValue',
  required: false,
};

const mockComponentWithNotDuplicate = {
  id: mockComponentId,
  attrs: new DropdownModelAttrs ({
    dictionaryType: 'someDropdownType',
    isNotDuplicate: true,
    dictionaryList: []
  }),
  value: 'dropdownValue',
  required: false,
};

const mockComponentWithEmptyPlaceholder = {
  id: mockComponentId,
  attrs: new DropdownModelAttrs ({
    dictionaryType: 'someDropdownType',
    placeholder: '',
    dictionaryList: []
  }),
  value: 'dropdownValue',
  required: false,
};

const mockComponentWithFilledPlaceholder = {
  id: mockComponentId,
  attrs: new DropdownModelAttrs ({
    dictionaryType: 'someDropdownType',
    placeholder: 'Выбрать',
    dictionaryList: []
  }),
  value: 'dropdownValue',
  required: false,
};

const mockDropDowns1 = [
  {
    id: '1',
    text: 'Test dropdown 1',
  },
  {
    id: '2',
    text: 'Test dropdown 2',
  },
];

const mockDropDowns2  = [
  {
    id: '3',
    text: 'Test dropdown 3',
  },
  {
    id: '4',
    text: 'Test dropdown 4',
  },
];

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let dictionaryToolsService: DictionaryToolsService;
  let formService: ComponentsListFormServiceStub;
  let service: SuggestHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent, MockComponent(ComponentItemComponent)],
      imports: [ValidationTypeModule, BaseUiModule, HttpClientModule],
      providers: [
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        MockProviders(
          ComponentsListRelationsService,
          DatesToolsService,
          SuggestHandlerService,
          ValidationService,
          EventBusService,
        ),
      ],
    })
      .overrideComponent(DropdownComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
        },
      })
      .compileComponents();
  });

  let valueControl: FormControl;
  let control: FormGroup;

  beforeEach(() => {
    service = TestBed.inject(SuggestHandlerService);
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;

    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
      model: new FormControl(new DropdownModel({ attrs: mockComponent.attrs } as any)),
    });
    formService['_form'] = new FormArray([control]);

    fixture = TestBed.createComponent(DropdownComponent);

    component = fixture.componentInstance;
    component.componentIndex = 0;

    fixture.detectChanges();
  });

  it('Component should be instance of Dropdown Component', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render lib-dropdown', () => {
    const selector = 'lib-dropdown';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
    fixture.detectChanges();
  });

  describe('placeholder', () => {
    it('should be default if property is missing', () => {
      const selector = 'lib-dropdown';
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.placeholder).toEqual('—');
      fixture.detectChanges();
    });

    it('should be default if property is empty', () => {
      control = new FormGroup({
        id: new FormControl(mockComponent.id),
        attrs: new FormControl(mockComponentWithEmptyPlaceholder.attrs),
        value: valueControl,
        required: new FormControl(mockComponent.required),
        model: new FormControl(new DropdownModel({ attrs: mockComponentWithEmptyPlaceholder.attrs } as any)),
      });
      formService['_form'] = new FormArray([control]);

      fixture = TestBed.createComponent(DropdownComponent);

      component = fixture.componentInstance;
      component.componentIndex = 0;
      fixture.detectChanges();

      const selector = 'lib-dropdown';
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.placeholder).toEqual('—');
      fixture.detectChanges();
    });

    it('should be custom if property is present', () => {
      control = new FormGroup({
        id: new FormControl(mockComponent.id),
        attrs: new FormControl(mockComponentWithFilledPlaceholder.attrs),
        value: valueControl,
        required: new FormControl(mockComponent.required),
        model: new FormControl(new DropdownModel({ attrs: mockComponentWithFilledPlaceholder.attrs } as any)),
      });
      formService['_form'] = new FormArray([control]);

      fixture = TestBed.createComponent(DropdownComponent);

      component = fixture.componentInstance;
      component.componentIndex = 0;
      fixture.detectChanges();

      const selector = 'lib-dropdown';
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.placeholder).toEqual(
        mockComponentWithFilledPlaceholder.attrs.placeholder,
      );
      fixture.detectChanges();
    });
  });

  it('isNotDuplicate should be the same as component attrs field', () => {
    expect(component['isNotDuplicate']).toEqual(mockComponent.attrs.isNotDuplicate);
  });

  describe('ngOnInit', () => {
    it('should set valid source and active dropDowns', () => {
      component['isNotDuplicate'] = true;
      component.model['_dropDown$'].next(mockDropDowns1);
      expect(component.dropDowns).toEqual(mockDropDowns1);
      expect(component['sourceDropDowns']).toEqual(mockDropDowns1);
      component.model['_dropDown$'].next(mockDropDowns2);
      expect(component.dropDowns).toEqual(mockDropDowns2);
      expect(component['sourceDropDowns']).toEqual(mockDropDowns2);
    });
  });

  describe('onChange', () => {
    it('should call updateDropDowns and set selectedDropDown event when have event with dropDown', () => {
      jest.spyOn<any, string>(component, 'updateDropDowns');
      expect(component['selectedDropDown']).toBeUndefined();
      component['isNotDuplicate'] = true;
      fixture.detectChanges();
      component.onChange(mockDropDowns1[0]);
      expect(component['selectedDropDown']).not.toBeNull();
      expect(component['updateDropDowns']).toHaveBeenCalledWith(DropDownUpdateTypes.delete);
    });

    it('should call updateDropDowns and set selectedDropDown null when have not event with dropDown', () => {
      jest.spyOn<any, string>(component, 'updateDropDowns');
      expect(component['selectedDropDown']).not.toBeNull();
      component['isNotDuplicate'] = true;
      fixture.detectChanges();
      component.onChange();
      expect(component['selectedDropDown']).toBeNull();
      expect(component['updateDropDowns']).toHaveBeenCalledWith(DropDownUpdateTypes.add);
    });
  });

  describe('ngOnDestroy', () => {
    it('should set selectedDropDown null when component destroyed', () => {
      expect(component['selectedDropDown']).not.toBeNull();
      component['isNotDuplicate'] = true;
      fixture.detectChanges();
      component.ngOnDestroy();
      expect(component['selectedDropDown']).toBeNull();
    });
  });

  xdescribe('getPreparedDropDowns', () => {
    it('should return valid array with prepared dropDowns', () => {
      const preparedDropDowns = component['getPreparedDropDowns'](mockDropDowns1);
      expect(JSON.stringify(preparedDropDowns)).toEqual(JSON.stringify('mockDropDowns1'));
    });
  });

  describe('dropDowns', () => {
    it('should have selectedDropDown when receive update', () => {
      valueControl = new FormControl(mockComponentWithNotDuplicate.value);
      control = new FormGroup({
        id: new FormControl(mockComponentWithNotDuplicate.id),
        attrs: new FormControl(mockComponentWithNotDuplicate.attrs),
        value: valueControl,
        required: new FormControl(mockComponentWithNotDuplicate.required),
        model: new FormControl(new DropdownModel({ attrs: mockComponentWithNotDuplicate.attrs } as any)),
      });
      formService['_form'] = new FormArray([control]);

      fixture = TestBed.createComponent(DropdownComponent);

      component = fixture.componentInstance;
      component.componentIndex = 0;
      fixture.detectChanges();

      component.onChange(mockDropDowns1[1]);
      component.ngOnInit();
      const array = [mockDropDowns1[1]];
      component.model['_dropDown$'].next(array);
      expect(component.dropDowns).toContain(mockDropDowns1[1]);
    });
  });
});
