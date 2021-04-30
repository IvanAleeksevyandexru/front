import { cloneDeep } from 'lodash';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { MockComponents, MockPipe } from 'ng-mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { ConfigService } from '../../core/services/config/config.service';
import { ConfigServiceStub } from '../../core/services/config/config.service.stub';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { MaskHandlePipe } from '../../shared/pipes/mask-handle/mask-handle.pipe';
import { DictionaryApiService } from '../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../shared/services/dictionary/dictionary-api.service.stub';
import { ComponentsListComponent } from './components-list.component';
import { ComponentsListFormService } from './services/components-list-form/components-list-form.service';
import { ComponentsListToolsService } from './services/components-list-tools/components-list-tools.service';
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { ConstructorPlainInputComponent } from '../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { ConstructorDadataWidgetComponent } from '../../shared/components/constructor-dadata-widget/constructor-dadata-widget.component';
import { ConstructorDropdownComponent } from '../../shared/components/constructor-dropdown/constructor-dropdown.component';
import { ConstructorLookupComponent } from '../../shared/components/constructor-lookup/constructor-lookup.component';
import { ConstructorCheckboxComponent } from '../../shared/components/constructor-checkbox/constructor-checkbox.component';
import { ConstructorDatePickerComponent } from '../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { ConstructorMultilineInputComponent } from '../../shared/components/constructor-multiline-input/constructor-multiline-input.component';
import { ComponentItemComponent } from './components/component-item/component-item.component';
import { PassportComponent } from '../../shared/components/add-passport/passport.component';
import { DocInputComponent } from './components/doc-input/doc-input.component';
import { FieldListComponent } from '../../shared/components/field-list/field-list.component';
import { OutputHtmlComponent } from '../../shared/components/output-html/output-html.component';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { ScreenService } from '../../screen/screen.service';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { AddressHelperService } from '../../shared/services/address-helper/address-helper.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { CachedAnswersService } from '../../shared/services/cached-answers/cached-answers.service';
import { PrepareComponentsService } from '../../shared/services/prepare-components/prepare-components.service';
import { UtilsService } from '../../core/services/utils/utils.service';
import { LoggerService } from '../../core/services/logger/logger.service';
import { MemoModule } from '../../shared/pipes/memo/memo.module';
import { DictionaryToolsService } from '../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListRelationsService } from './services/components-list-relations/components-list-relations.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ComponentsListFormServiceStub } from './services/components-list-form/components-list-form.service.stub';
import { DeviceDetectorService } from '../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../core/services/device-detector/device-detector.service.stub';
import { ShowComponentPipe } from './show-component/show-component.pipe';
import { RefRelationService } from '../../shared/services/ref-relation/ref-relation.service';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';
import { DateRestrictionsService } from '../../shared/services/date-restrictions/date-restrictions.service';
import { mockComponentsListComponentStore } from './mocks/mock-components-list';

// TODO: написать тест
describe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;
  let formService: ComponentsListFormService;

  configureTestSuite( () => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MemoModule,
      ],
      declarations: [
        ComponentsListComponent,
        ShowComponentPipe,
        MockPipe(MaskHandlePipe),
        MockComponents(
          ConstructorPlainInputComponent,
          ConstructorDadataWidgetComponent,
          ConstructorDropdownComponent,
          ConstructorLookupComponent,
          ConstructorCheckboxComponent,
          ConstructorDatePickerComponent,
          ConstructorMultilineInputComponent,
          ComponentItemComponent,
          PassportComponent,
          DocInputComponent,
          FieldListComponent,
          OutputHtmlComponent
        )
      ],
      providers: [
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        EventBusService,
        ValidationService,
        ComponentsListToolsService,
        ScreenService,
        DateRangeService,
        DatesToolsService,
        AddressHelperService,
        CurrentAnswersService,
        PrepareComponentsService,
        CachedAnswersService,
        UtilsService,
        LoggerService,
        DictionaryToolsService,
        ComponentsListRelationsService,
        UnsubscribeService,
        RefRelationService,
        SuggestHandlerService,
        DateRestrictionsService,
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ComponentsListComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default,
        providers: [
          { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        ]
      },
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListComponent);
    component = fixture.componentInstance;
    formService = TestBed.inject(ComponentsListFormService);
    component.components = cloneDeep(mockComponentsListComponentStore.display.components);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
