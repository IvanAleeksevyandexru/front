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
import { CustomListDictionaries } from '../../components-list.types';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { HttpClientModule } from '@angular/common/http';

const mockComponent = {
  id: 'mockComponentID',
  attrs: { dictionaryType: 'someDictionaryType' },
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
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        MockProvider(DatesToolsService),
        MockProvider(ComponentsListRelationsService),
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
    expect(debugEl.componentInstance.component).toEqual(mockComponent);
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
      dictionaryToolsService.dictionaries$.next(({
        someDictionaryTypemockComponentID: {
          list: [{ id: 1, text: 'some-text' }],
        },
      } as unknown) as CustomListDictionaries);
    });

    it('Should render Lib DropDown', () => {
      expect(fixture.debugElement.query(By.css(selector))).toBeNull();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector))).toBeTruthy();
    });

    it('Should render Lib DropDown', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector)).componentInstance.disabled).toBeTruthy();
      dictionaryToolsService.dictionaries$.next(({
        someDictionaryTypemockComponentID: {
          list: [
            { id: 1, text: 'some-text' },
            { id: 2, text: 'some-text2' },
          ],
        },
      } as unknown) as CustomListDictionaries);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css(selector)).componentInstance.disabled).toBeFalsy();
    });

    it('Should set value if list length equal 1', () => {
      const mockItem = {
        id: 1,
        text: 'some-text',
      };

      dictionaryToolsService.dictionaries$.next((mockItem as unknown) as CustomListDictionaries);
      fixture.detectChanges();
      expect(formService['_form'].value[0].value).toEqual(mockItem);
    });
  });
});
