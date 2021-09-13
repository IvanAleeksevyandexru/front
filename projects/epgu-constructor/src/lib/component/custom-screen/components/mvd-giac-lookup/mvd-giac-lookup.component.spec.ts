import { MvdGiacLookupComponent } from './mvd-giac-lookup.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { EpguLibModule, ValidationShowOn } from '@epgu/epgu-lib';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { By } from '@angular/platform-browser';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { CustomListDropDowns } from '../../components-list.types';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import { configureTestSuite } from 'ng-bullet';
import { DatesToolsService, ConfigService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';

describe('MvdGiacLookupComponent', () => {
  let component: MvdGiacLookupComponent;
  let fixture: ComponentFixture<MvdGiacLookupComponent>;

  let dictionaryToolsService: DictionaryToolsService;

  let formService: ComponentsListFormServiceStub;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [MvdGiacLookupComponent, MockComponent(ComponentItemComponent)],
      imports: [MockModule(EpguLibModule)],
      providers: [
        DictionaryToolsService,
        JsonHelperService,
        DatesToolsService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        ConfigService,
        LoggerService,
      ],
    })
      .overrideComponent(MvdGiacLookupComponent, {
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
    control = new FormGroup({
      id: new FormControl('someId'),
      value: valueControl,
    });
    formService['_form'] = new FormArray([control]);

    fixture = TestBed.createComponent(MvdGiacLookupComponent);
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
    expect(debugEl.componentInstance.component).toEqual({
      id: 'someId',
      value: 'some value',
    });
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
      // по умолчанию dropDowns пустой массив, соответственно TRUTHY
      expect(debugEl).toBeTruthy();

      dictionaryToolsService.dropDowns$.next(null);
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

      expect(debugEl.componentInstance.fixedItems).toBeUndefined();

      dictionaryToolsService.dropDowns$.next(({
        someId: [
          {
            text: 'some text',
          },
        ],
      } as unknown) as CustomListDropDowns);
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

      dictionaryToolsService.dropDowns$.next(({
        someId: [
          {
            text: 'some text',
          },
        ],
      } as unknown) as CustomListDropDowns);
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
