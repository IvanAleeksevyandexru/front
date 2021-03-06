import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockProvider } from 'ng-mocks';
import { ValidationShowOn } from '@epgu/ui/models/common-enums';
import { By } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import {
  DatesToolsService,
  ConfigService,
  LoggerService,
  BaseUiModule,
  JsonHelperService,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientModule } from '@angular/common/http';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { CustomListDropDowns } from '../../components-list.types';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { SearchableDropdownComponent } from './searchable-dropdown.component';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import SearchableDropdownModelAttrs from './SearchableDropdownModelAttrs';
import SearchableDropdownModel from './SearchableDropdownModel';
import { HelperService } from '@epgu/ui/services/helper';

describe('SearchableDropdownComponent', () => {
  let component: SearchableDropdownComponent;
  let fixture: ComponentFixture<SearchableDropdownComponent>;

  let dictionaryToolsService: DictionaryToolsService;

  let formService: ComponentsListFormServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchableDropdownComponent, MockComponent(ComponentItemComponent)],
      imports: [BaseUiModule, HttpClientModule],
      providers: [
        DictionaryToolsService,
        DatesToolsService,
        JsonHelperService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        MockProvider(ComponentsListRelationsService),
        MockProvider(HelperService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        ConfigService,
        LoggerService,
      ],
    })
      .overrideComponent(SearchableDropdownComponent, {
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

    valueControl = new FormControl('some value');
    const attrs = new SearchableDropdownModelAttrs({ dictionaryList: [] });
    control = new FormGroup({
      id: new FormControl('someId'),
      value: valueControl,
      attrs: new FormControl(attrs),
      model: new FormControl(new SearchableDropdownModel({ attrs } as any)),
    });
    formService._form = new FormArray([control]);

    fixture = TestBed.createComponent(SearchableDropdownComponent);
    component = fixture.componentInstance;

    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should extend AbstractComponentListItemComponent', () => {
    expect(component).toBeInstanceOf(AbstractComponentListItemComponent);
  });

  it('should render epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';

    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.control).toBe(valueControl);
    expect(debugEl.componentInstance.component.id).toEqual('someId');
    expect(debugEl.componentInstance.component.value).toEqual('some value');

    expect(debugEl.componentInstance.invalid).toBeFalsy();

    component.control.setErrors({
      someErrorKey: true,
    });
    fixture.detectChanges();

    expect(debugEl.componentInstance.invalid).toBeTruthy();
  });

  describe('lib-lookup', () => {
    const selector = 'lib-lookup';

    it('should be rendered if dropDowns is TRUTHY', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      // ???? ?????????????????? dropDowns ???????????? ????????????, ???????????????????????????? TRUTHY
      expect(debugEl).toBeTruthy();
      component.model._dropDown$.next(null);
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });

    it('invalid property is TRUE if value control is invalid and touched', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.invalid).toBeFalsy();

      valueControl.setErrors({
        someErrorKey: true,
      });
      fixture.detectChanges();

      expect(debugEl.componentInstance.invalid).toBeFalsy();

      valueControl.markAsTouched();
      fixture.detectChanges();

      expect(debugEl.componentInstance.invalid).toBeTruthy();
    });

    it('fixedItems property', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      component.model._dropDown$.next(([
        {
          text: 'some text',
        },
      ] as unknown) as CustomListDropDowns);
      fixture.detectChanges();

      expect(debugEl.componentInstance.fixedItems).toEqual([
        {
          text: 'some text',
        },
      ]);
    });

    it('disabled property', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.disabled).toBeFalsy();

      component.model._dropDown$.next(([
        {
          text: 'some text',
        },
      ] as unknown) as CustomListDropDowns);
      fixture.detectChanges();

      expect(debugEl.componentInstance.disabled).toBeTruthy();
    });

    it('validationShowOn, clearable, queryMinSymbolsCount, searchCaseSensitive, virtualScroll properties', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.TOUCHED_UNFOCUSED);
      expect(debugEl.componentInstance.clearable).toBeTruthy();
      expect(debugEl.componentInstance.queryMinSymbolsCount).toBe(0);
      expect(debugEl.componentInstance.searchCaseSensitive).toBeFalsy();
      expect(debugEl.componentInstance.virtualScroll).toBeTruthy();
    });
  });
});
