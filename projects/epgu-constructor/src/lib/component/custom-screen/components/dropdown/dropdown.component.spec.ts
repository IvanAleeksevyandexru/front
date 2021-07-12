import { DropdownComponent } from './dropdown.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { ComponentItemComponent } from '../component-item/component-item.component';
import { DictionaryToolsService } from '../../../../shared/services/dictionary/dictionary-tools.service';
import { ChangeDetectionStrategy } from '@angular/core';
import { AbstractComponentListItemComponent } from '../abstract-component-list-item/abstract-component-list-item.component';
import {
  ConfigService, DatesToolsService, EventBusService,
  LoggerService, UnsubscribeService
} from '@epgu/epgu-constructor-ui-kit';
import { By } from '@angular/platform-browser';
import { ComponentsListFormServiceStub } from '../../services/components-list-form/components-list-form.service.stub';
import { EpguLibModule } from '@epgu/epgu-lib';
import { DictionaryApiService } from '../../../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListRelationsService } from '../../services/components-list-relations/components-list-relations.service';
import { ComponentsListFormService } from '../../services/components-list-form/components-list-form.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ValidationTypeModule } from '../../../../shared/directives/validation-type/validation-type.module';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { SuggestHandlerService } from '../../../../shared/services/suggest-handler/suggest-handler.service';
import { SuggestMonitorService } from '../../../../shared/services/suggest-monitor/suggest-monitor.service';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { DateRangeService } from '../../../../shared/services/date-range/date-range.service';
import { DateRestrictionsService } from '../../../../shared/services/date-restrictions/date-restrictions.service';

const mockComponent = {
  id: 'mockComponentID',
  attrs: { dictionaryType: 'someDropdownType' },
  value: 'dropdownValue',
  required: false,
};

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;
  let dictionaryToolsService: DictionaryToolsService;
  let formService: ComponentsListFormServiceStub;
  let service: SuggestHandlerService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DropdownComponent,
        MockComponent(ComponentItemComponent)
      ],
      imports: [
        MockModule(EpguLibModule),
        ValidationTypeModule,
      ],
      providers: [
        DictionaryToolsService,
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        DatesToolsService,
        MockProvider(ComponentsListRelationsService),
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
        ConfigService,
        LoggerService,
        SuggestHandlerService,
        EventBusService,
        SuggestMonitorService,
        ValidationService,
        DateRangeService,
        DateRestrictionsService
      ]
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
    formService = (TestBed.inject(ComponentsListFormService) as unknown) as ComponentsListFormServiceStub;

    valueControl = new FormControl(mockComponent.value);
    control = new FormGroup({
      id: new FormControl(mockComponent.id),
      attrs: new FormControl(mockComponent.attrs),
      value: valueControl,
      required: new FormControl(mockComponent.required),
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
    expect(debugEl.componentInstance.component).toEqual(mockComponent);
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
});
