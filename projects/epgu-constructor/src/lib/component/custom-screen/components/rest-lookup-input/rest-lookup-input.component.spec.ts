import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import {
  BaseUiModule,
  ConfigService,
  ConfigServiceStub,
  EventBusService,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DictionaryComponent } from '../dictionary/dictionary.component';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { RestLookupInputComponent } from './rest-lookup-input.component';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { RestToolsService } from '../../../../shared/services/rest-tools/rest-tools.service';
import RestLookupInputModelAttrs from './RestLookupInputModelAttrs';
import RestLookupInputModel from './RestLookupInputModel';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { InterpolationService } from '../../../../shared/services/interpolation/interpolation.service';
import { ComponentsListRelationsServiceStub } from '../../services/components-list-relations/components-list-relations.service.stub';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../../../../shared/services/dictionary/dictionary-tools.service.stub';
import { ComponentsListToolsService } from '../../services/components-list-tools/components-list-tools.service';
import { DictionaryService } from '../../../../shared/services/dictionary/dictionary.service';
import { DictionaryServiceStub } from '../../../../shared/services/dictionary/dictionary.service.stub';

const mockComponent = {
  id: 'mockComponentID',
  attrs: new RestLookupInputModelAttrs({
    dictionaryType: 'lookUpInputType',
    searchProvider: {
      dictionaryOptions: { additionalParams: [] },
      dictionaryFilter: [
        {
          attributeName: 'Session_Id',
          condition: 'EQUALS' as any,
          value: 'value',
          valueType: 'rawFilter',
        },
      ],
    },
  }),
  value: 'lookUpInput',
  required: false,
};

describe('RestLookupInputComponent', () => {
  let component: RestLookupInputComponent;
  let fixture: ComponentFixture<RestLookupInputComponent>;
  let formService: ComponentsListFormServiceStub;

  beforeEach(() => {
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
        { provide: ScreenService, useClass: ScreenServiceStub },
        MockProvider(ComponentsListToolsService),
        MockProvider(InterpolationService),
        { provide: ComponentsListRelationsService, useClass: ComponentsListRelationsServiceStub },
        { provide: DictionaryService, useClass: DictionaryServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
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
    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
      model: new FormControl(new RestLookupInputModel({ attrs: mockComponent.attrs } as any)),
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
    expect(debugEl.componentInstance.component.id).toEqual(mockComponent.id);
    expect(debugEl.componentInstance.invalid).toBeFalsy();
    component.control.setErrors({
      someErrorKey: true,
    });
    fixture.detectChanges();
    expect(debugEl.componentInstance.invalid).toBeTruthy();
  });
});
