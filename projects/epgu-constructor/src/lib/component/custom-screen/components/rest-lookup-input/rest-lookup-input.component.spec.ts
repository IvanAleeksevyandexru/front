import { DictionaryComponent } from '../dictionary/dictionary.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import {
  BaseUiModule,
  ConfigService,
  ConfigServiceStub,
  EventBusService,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { RestLookupInputComponent } from './rest-lookup-input.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { By } from '@angular/platform-browser';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

describe('RestLookupInputComponent', () => {
  let component: RestLookupInputComponent;
  let fixture: ComponentFixture<RestLookupInputComponent>;
  let formService: ComponentsListFormServiceStub;
  let restToolsService: RestToolsService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RestLookupInputComponent, MockComponent(ComponentItemComponent)],
      imports: [
        MockModule(ValidationTypeModule),
        MockModule(BaseUiModule),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        MockProvider(ComponentsListRelationsService),
        MockProvider(RestToolsService),
        MockProvider(SuggestHandlerService),
        MockProvider(EventBusService),
        MockProvider(SuggestMonitorService),
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
    formService = (TestBed.inject(
      ComponentsListFormService,
    ) as unknown) as ComponentsListFormServiceStub;
    restToolsService = TestBed.inject(RestToolsService);
    jest.spyOn(restToolsService, 'dictionaries$', 'get').mockReturnValue(of({}));
    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
    });
    formService.form = new FormArray([control]);
    fixture = TestBed.createComponent(RestLookupInputComponent);
    component = fixture.componentInstance;
    component.componentIndex = 0;
    fixture.detectChanges();
  });

  it('should be', function () {
    expect(component).toBeInstanceOf(RestLookupInputComponent);
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
});
