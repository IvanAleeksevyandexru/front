import { MvdGiacLookupComponent } from './mvd-giac-lookup.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { EpguLibModule, ValidationShowOn } from 'epgu-lib';
import { ComponentItemComponent } from '../../../component-item/component-item.component';
import { DictionaryToolsService } from '../../../../services/dictionary/dictionary-tools.service';
import { DictionaryApiService } from '../../../../services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../../../services/components-list-relations/components-list-relations.service';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy } from '@angular/core';
import { CustomListDropDowns } from '../../components-list.types';

describe('MvdGiacLookupComponent', () => {
  let component: MvdGiacLookupComponent;
  let fixture: ComponentFixture<MvdGiacLookupComponent>;

  let dictionaryToolsService: DictionaryToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MvdGiacLookupComponent,
        MockComponent(ComponentItemComponent)
      ],
      imports: [MockModule(EpguLibModule)],
      providers: [
        DictionaryToolsService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        MockProvider(ComponentsListRelationsService)
      ],
    }).overrideComponent(MvdGiacLookupComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);

    fixture = TestBed.createComponent(MvdGiacLookupComponent);
    component = fixture.componentInstance;
  });

  it('should render epgu-constructor-component-item', () => {
    const selector = 'epgu-constructor-component-item';

    const valueControl = new FormControl('some value');

    component.control = new FormGroup({
      value: valueControl
    });

    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.control).toBe(valueControl);
    expect(debugEl.componentInstance.component).toEqual({
      value: 'some value'
    });
    expect(debugEl.componentInstance.invalid).toBeFalsy();

    component.control.setErrors({
      someErrorKey: true
    });
    fixture.detectChanges();

    expect(debugEl.componentInstance.invalid).toBeTruthy();
  });

  describe('lib-lookup', () => {
    const selector = 'lib-lookup';

    it('should be rendered if dropDowns is TRUTHY', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      component.control = new FormGroup({
        value: new FormControl('some value')
      });
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      // по умолчанию dropDowns пустой массив, соответственно TRUTHY
      expect(debugEl).toBeTruthy();

      dictionaryToolsService.dropDowns$.next(null);
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });

    it('invalid property is TRUE if value control is invalid and touched', () => {
      const valueControl = new FormControl('some value');
      component.control = new FormGroup({
        value: valueControl
      });
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.invalid).toBeFalsy();

      valueControl.setErrors({
        someErrorKey: true
      });
      fixture.detectChanges();

      expect(debugEl.componentInstance.invalid).toBeFalsy();

      valueControl.markAsTouched();
      fixture.detectChanges();

      expect(debugEl.componentInstance.invalid).toBeTruthy();
    });

    it('fixedItems property', () => {
      component.control = new FormGroup({
        id: new FormControl('someId'),
        value: new FormControl('some value')
      });
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.fixedItems).toBeUndefined();

      dictionaryToolsService.dropDowns$.next({
        someId: [
          {
            text: 'some text'
          }
        ]
      } as unknown as CustomListDropDowns);
      fixture.detectChanges();

      expect(debugEl.componentInstance.fixedItems).toEqual([
        {
          text: 'some text'
        }
      ]);
    });

    it('disabled property', () => {
      component.control = new FormGroup({
        id: new FormControl('someId'),
        value: new FormControl('some value')
      });
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.disabled).toBeFalsy();

      dictionaryToolsService.dropDowns$.next({
        someId: [
          {
            text: 'some text'
          }
        ]
      } as unknown as CustomListDropDowns);
      fixture.detectChanges();

      expect(debugEl.componentInstance.disabled).toBeTruthy();
    });

    it('validationShowOn, clearable, queryMinSymbolsCount, searchCaseSensitive, virtualScroll properties', () => {
      component.control = new FormGroup({
        id: new FormControl('someId'),
        value: new FormControl('some value')
      });
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.validationShowOn).toBe(ValidationShowOn.TOUCHED_UNFOCUSED);
      expect(debugEl.componentInstance.clearable).toBeTruthy();
      expect(debugEl.componentInstance.queryMinSymbolsCount).toBe(0);
      expect(debugEl.componentInstance.searchCaseSensitive).toBeFalsy();
      expect(debugEl.componentInstance.virtualScroll).toBeTruthy();
    });
  });
});
