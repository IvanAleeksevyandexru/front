import { DictionaryComponent } from '../dictionary/dictionary.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { EpguLibModule } from '@epgu/epgu-lib';
import { ActivatedRoute } from '@angular/router';
import {
  ConfigService, ConfigServiceStub,
  DatesToolsService,
  EventBusService,
  LoggerService,
  UnsubscribeService,
  ActivatedRouteStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { RestLookupInputComponent } from './rest-lookup-input.component';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ScreenService } from 'projects/epgu-constructor/src/lib/screen/screen.service';
import { CurrentAnswersService } from 'projects/epgu-constructor/src/lib/screen/current-answers.service';
import { ScreenServiceStub } from 'projects/epgu-constructor/src/lib/screen/screen.service.stub';
import { By } from '@angular/platform-browser';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';
import { of } from 'rxjs';

const mockComponent = {
  id: 'mockComponentID',
  attrs: {
    dictionaryType: 'lookUpInputType',
    searchProvider: {
      dictionaryOptions: { additionalParams: [] },
      dictionaryFilter: [{
        attributeName: 'Session_Id',
        condition: 'EQUALS',
        value: 'value',
        valueType: 'rawFilter'
      }],
    }
  },
  value: 'lookUpInput',
  required: false,
};


describe('RestLookupInputComponent', () => {
  let component: RestLookupInputComponent;
  let fixture: ComponentFixture<RestLookupInputComponent>;
  let restToolsService: RestToolsService;
  let formService: ComponentsListFormServiceStub;
  let providerSearchSpy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        RestLookupInputComponent,
        MockComponent(ComponentItemComponent)
      ],
      imports: [
        MockModule(EpguLibModule),
        MockModule(ValidationTypeModule)
      ],
      providers: [
        MockProvider(RestToolsService),
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        DatesToolsService,
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        UnsubscribeService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        SuggestHandlerService,
        EventBusService,
        CurrentAnswersService,
        LoggerService,
        SuggestMonitorService,
      ]
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
    restToolsService = TestBed.inject(RestToolsService);
    jest.spyOn(restToolsService, 'dictionaries$', 'get').mockReturnValue(of({}));
    formService = (TestBed.inject(ComponentsListFormService) as unknown) as ComponentsListFormServiceStub;
    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
    });
    formService['_form'] = new FormArray([control]);
    fixture = TestBed.createComponent(RestLookupInputComponent);
    component = fixture.componentInstance;
    // @ts-ignore
    // providerSearchSpy = jest.spyOn<any>(component, 'providerSearch');
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