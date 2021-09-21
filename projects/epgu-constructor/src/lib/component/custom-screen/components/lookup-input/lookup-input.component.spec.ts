import { DictionaryComponent } from '../dictionary/dictionary.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigService,
  ConfigServiceStub,
  DatesToolsService,
  EventBusService,
  LoggerService,
  UnsubscribeService,
  ActivatedRouteStub,
  BaseUiModule,
  DatesToolsServiceStub,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { LookupInputComponent } from './lookup-input.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { By } from '@angular/platform-browser';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { HttpClientModule } from '@angular/common/http';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';

const mockComponent = {
  id: 'mockComponentID',
  attrs: {
    dictionaryType: 'lookUpInputType',
    searchProvider: {
      dictionaryOptions: { additionalParams: [] },
      dictionaryFilter: [
        {
          attributeName: 'Session_Id',
          condition: 'EQUALS',
          value: 'value',
          valueType: 'rawFilter',
        },
      ],
    },
  },
  value: 'lookUpInput',
  required: false,
};

describe('LookupInputComponent', () => {
  let component: LookupInputComponent;
  let fixture: ComponentFixture<LookupInputComponent>;
  let formService: ComponentsListFormService;
  let providerSearchSpy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [LookupInputComponent, MockComponent(ComponentItemComponent)],
      imports: [MockModule(ValidationTypeModule), MockModule(BaseUiModule), HttpClientModule],
      providers: [
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        MockProvider(JsonHelperService),
        MockProvider(ComponentsListRelationsService),
        MockProvider(SuggestHandlerService),
        MockProvider(EventBusService),
        MockProvider(SuggestMonitorService),
        MockProvider(ComponentsListRelationsService),
        CurrentAnswersService,
        LoggerService,
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
    formService = TestBed.inject(ComponentsListFormService);
    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
    });
    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(LookupInputComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    providerSearchSpy = jest.spyOn<any>(component, 'providerSearch');
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should be', function () {
    expect(component).toBeInstanceOf(LookupInputComponent);
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

  it('Expect searchProvider to be called once', () => {
    component.provider.search('test').subscribe();
    expect(providerSearchSpy).toBeCalled();
  });
});
