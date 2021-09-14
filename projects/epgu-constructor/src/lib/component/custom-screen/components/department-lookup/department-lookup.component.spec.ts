import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { configureTestSuite } from 'ng-bullet';
import { By } from '@angular/platform-browser';
import { MockComponents, MockModule, MockProviders } from 'ng-mocks';
import { ValidationShowOn } from '@epgu/epgu-lib';
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
import { CustomListDictionaries } from '../../components-list.types';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';

const mockComponent = {
  id: 'SomeId',
  attrs: { dictionaryType: 'someDictionaryType' },
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
        MockProviders(DatesToolsService, ComponentsListRelationsService, SuggestHandlerService),
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

    valueControl = new FormControl(mockComponent.value);

    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
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
    expect(debugEl.componentInstance.component).toEqual(mockComponent);
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
      dictionaryToolsService.dictionaries$.next(({
        someDictionaryTypeSomeId: [
          {
            text: 'some text',
          },
        ],
      } as unknown) as CustomListDictionaries);
    });

    it('should be rendered if dropDowns is TRUTHY', () => {
      expect(fixture.debugElement.query(By.css(selector))).toBeNull();
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

      expect(debugEl.componentInstance.component).toStrictEqual(mockComponent);
      expect(debugEl.componentInstance.dictionary).toStrictEqual([{ text: 'some text' }]);
      expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.TOUCHED_UNFOCUSED);
      expect(debugEl.componentInstance.control).toBe(valueControl);
      expect(debugEl.componentInstance.required).toBeFalsy();
      expect(debugEl.componentInstance.attrs).toBe(mockComponent.attrs);
    });
  });
});
