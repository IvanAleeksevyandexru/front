import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { cloneDeep } from 'lodash';
import {
  EventBusService,
  ConfigService,
  ConfigServiceStub,
  ConstructorCheckboxComponent,
  ConstructorDropdownComponent,
  ConstructorLookupComponent,
  MaskHandlePipe,
  MemoModule,
  LoggerService,
  UnsubscribeService,
  DeviceDetectorService,
  DeviceDetectorServiceStub,
  LocalStorageService,
  LocalStorageServiceStub,
  HttpCancelService,
  ObjectHelperService,
} from '@epgu/epgu-constructor-ui-kit';

import { AddressHelperService } from '../../shared/services/address-helper/address-helper.service';
import { CachedAnswersService } from '../../shared/services/cached-answers/cached-answers.service';
import { ComponentItemComponent } from './components/component-item/component-item.component';
import { ComponentsListComponent } from './components-list.component';
import { ComponentsListFormService } from './services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from './services/components-list-form/components-list-form.service.stub';
import { ComponentsListToolsService } from './services/components-list-tools/components-list-tools.service';
import { ComponentsListRelationsService } from './services/components-list-relations/components-list-relations.service';
import { ConstructorDadataWidgetComponent } from '../../shared/components/constructor-dadata-widget/constructor-dadata-widget.component';
import { ConstructorDatePickerComponent } from '../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { ConstructorMultilineInputComponent } from '../../shared/components/constructor-multiline-input/constructor-multiline-input.component';
import { ConstructorPlainInputComponent } from '../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { DateRefService } from '../../core/services/date-ref/date-ref.service';
import { DateRestrictionsService } from '../../shared/services/date-restrictions/date-restrictions.service';
import { DecimalPipe } from '@angular/common';
import { DictionaryToolsService } from '../../shared/services/dictionary/dictionary-tools.service';
import { DictionaryToolsServiceStub } from '../../shared/services/dictionary/dictionary-tools.service.stub';
import { DownloadService, HealthService, HealthServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { DatesToolsService } from '@epgu/epgu-constructor-ui-kit';
import { DictionaryApiService } from '../../shared/services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../shared/services/dictionary/dictionary-api.service.stub';
import { DocInputComponent } from './components/doc-input/doc-input.component';
import { FieldListComponent } from '../../shared/components/field-list/field-list.component';
import { JsonHelperService } from '../../core/services/json-helper/json-helper.service';
import { MaskTransformService } from '../../shared/directives/mask/mask-transform.service';
import { OutputHtmlComponent } from '../../shared/components/output-html/output-html.component';
import { PassportComponent } from '../../shared/components/add-passport/passport.component';
import { PrepareComponentsService } from '../../shared/services/prepare-components/prepare-components.service';
import { RefRelationService } from '../../shared/services/ref-relation/ref-relation.service';
import { RestToolsService } from '../../shared/services/rest-tools/rest-tools.service';
import { RestToolsServiceStub } from '../../shared/services/rest-tools/rest-tools.service.stub';
import { ScreenService } from '../../screen/screen.service';
import { ShowComponentPipe } from './show-component/show-component.pipe';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';
import { SuggestMonitorService } from '../../shared/services/suggest-monitor/suggest-monitor.service';
import { TypeCastService } from '../../core/services/type-cast/type-cast.service';
import { ValidationService } from '../../shared/services/validation/validation.service';

import { mockComponentsListComponentStore } from './mocks/mock-components-list';

describe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;

  let dictionaryToolsService: DictionaryToolsService;
  let eventBusService: EventBusService;
  let formService: ComponentsListFormService;
  let httpCancelService: HttpCancelService;
  let restToolsService: RestToolsService;
  let unsubscribeService: UnsubscribeService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, MemoModule, ReactiveFormsModule],
      declarations: [
        MockPipe(MaskHandlePipe),
        MockComponents(
          ComponentItemComponent,
          ConstructorCheckboxComponent,
          ConstructorDadataWidgetComponent,
          ConstructorDatePickerComponent,
          ConstructorDropdownComponent,
          ConstructorLookupComponent,
          ConstructorMultilineInputComponent,
          ConstructorPlainInputComponent,
          DocInputComponent,
          FieldListComponent,
          OutputHtmlComponent,
          PassportComponent,
        ),
        ComponentsListComponent,
        ShowComponentPipe,
      ],
      providers: [
        { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: DictionaryToolsService, useClass: DictionaryToolsServiceStub },
        { provide: HealthService, useClass: HealthServiceStub },
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: RestToolsService, useClass: RestToolsServiceStub },
        MockProvider(DateRestrictionsService),
        MockProvider(PrepareComponentsService),
        AddressHelperService,
        CachedAnswersService,
        ComponentsListRelationsService,
        ComponentsListToolsService,
        CurrentAnswersService,
        DateRangeService,
        DateRefService,
        DatesToolsService,
        DecimalPipe,
        DownloadService,
        EventBusService,
        HttpCancelService,
        JsonHelperService,
        LoggerService,
        MaskTransformService,
        ObjectHelperService,
        RefRelationService,
        ScreenService,
        SuggestHandlerService,
        SuggestMonitorService,
        TypeCastService,
        UnsubscribeService,
        ValidationService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ComponentsListComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
          providers: [
            { provide: ComponentsListFormService, useClass: ComponentsListFormServiceStub },
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    dictionaryToolsService = TestBed.inject(DictionaryToolsService);
    formService = TestBed.inject(ComponentsListFormService);
    eventBusService = TestBed.inject(EventBusService);
    httpCancelService = TestBed.inject(HttpCancelService);
    restToolsService = TestBed.inject(RestToolsService);
    unsubscribeService = TestBed.inject(UnsubscribeService);

    fixture = TestBed.createComponent(ComponentsListComponent);
    component = fixture.componentInstance;

    component.components = cloneDeep(mockComponentsListComponentStore.display.components) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should call methods on init', () => {
      const eventBusServiceSpy = jest.spyOn(eventBusService, 'on');
      const watchForFiltersSpy = jest.spyOn<ComponentsListComponent, any>(
        component,
        'watchForFilters',
      );

      component.ngOnInit();

      expect(eventBusServiceSpy).toHaveBeenCalled();
      expect(watchForFiltersSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges()', () => {
    it('should call methods inside itself', () => {
      const unsubscribeSpy = jest.spyOn<ComponentsListComponent, any>(component, 'unsubscribe');
      const subscribeOnFormStatusChangingSpy = jest.spyOn<ComponentsListComponent, any>(
        component,
        'subscribeOnFormStatusChanging',
      );
      const loadRepository = jest.spyOn<ComponentsListComponent, any>(component, 'loadRepository');

      component.ngOnChanges({});

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(subscribeOnFormStatusChangingSpy).toHaveBeenCalled();
      expect(loadRepository).toHaveBeenCalled();
    });

    it('should trigger "emitFormCreated" emitter, when has components', () => {
      const spy = jest.spyOn(component.emitFormCreated, 'emit');

      const changes = {
        components: new SimpleChange(null, [], true),
      };
      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalled();
    });

    it('should not trigger "emitFormCreated" emitter, when has not components', () => {
      const spy = jest.spyOn(component.emitFormCreated, 'emit');

      component.ngOnChanges({});

      expect(spy).not.toHaveBeenCalled();
    });

    it('should trigger "handleScenarioErrors", when errors changed', () => {
      const spy = jest.spyOn<ComponentsListComponent, any>(component, 'handleScenarioErrors');

      const changes = {
        errors: new SimpleChange(null, '', true),
      };
      component.ngOnChanges(changes);

      expect(spy).toHaveBeenCalled();
    });

    it('should not trigger "handleScenarioErrors", when errors did not change', () => {
      const spy = jest.spyOn<ComponentsListComponent, any>(component, 'handleScenarioErrors');

      const changes = {
        errors: new SimpleChange(null, null, true),
      };
      component.ngOnChanges(changes);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy()', () => {
    it('should call "cancelPendingRequests"', () => {
      const spy = jest.spyOn(httpCancelService, 'cancelPendingRequests');

      component.shouldPendingRequestsBeCancelledAfterDestroy = true;
      component.ngOnDestroy();

      expect(spy).toHaveBeenCalled();
    });

    it('should not call "cancelPendingRequests"', () => {
      const spy = jest.spyOn(httpCancelService, 'cancelPendingRequests');

      component.shouldPendingRequestsBeCancelledAfterDestroy = false;
      component.ngOnDestroy();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('loadRepository()', () => {
    it('should load all needed data from services', () => {
      const dictionaryLoadReferenceDataSpy = jest.spyOn<DictionaryToolsService, any>(
        dictionaryToolsService,
        'loadReferenceData$',
      );
      const restLoadReferenceDataSpy = jest.spyOn<RestToolsService, any>(
        restToolsService,
        'loadReferenceData$',
      );

      component['loadRepository'](component.components);

      expect(dictionaryLoadReferenceDataSpy).toHaveBeenCalled();
      expect(restLoadReferenceDataSpy).toHaveBeenCalled();
    });
  });

  describe('watchForFilters()', () => {
    it('should subscribe to services updates', () => {
      const watchForFiltersSpy = jest.spyOn(dictionaryToolsService, 'watchForFilters');
      const watchForUpdatesSpy = jest.spyOn(restToolsService, 'watchForUpdates');

      component['watchForFilters'](component.components);

      expect(watchForFiltersSpy).toHaveBeenCalled();
      expect(watchForUpdatesSpy).toHaveBeenCalled();
    });
  });

  describe('subscribeOnFormStatusChanging()', () => {
    it('should emit form status changes when has observers', () => {
      const spy = jest.spyOn(component.emitFormStatus, 'emit');

      component.emitFormStatus.observers.push({
        // eslint-disable-next-line no-empty-function
        complete(): void {},
        // eslint-disable-next-line no-empty-function
        error(err: any): void {},
        // eslint-disable-next-line no-empty-function
        next(value: any): void {},
      });
      component['subscribeOnFormStatusChanging']();

      expect(spy).toHaveBeenCalled();
    });

    it('should not emit form status changes when has not observers', () => {
      const spy = jest.spyOn(component.emitFormStatus, 'emit');

      component['subscribeOnFormStatusChanging']();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should not listen for form status changes when has not observers', () => {
      const spy = jest.spyOn(component.emitFormStatus, 'emit');

      component['subscribeOnFormStatusChanging']();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('unsubscribe()', () => {
    it('should unsubscribe', () => {
      const nextSpy = spyOn(unsubscribeService.ngUnsubscribe$, 'next');
      const completeSpy = spyOn(unsubscribeService.ngUnsubscribe$, 'complete');

      component['unsubscribe']();

      expect(nextSpy).toHaveBeenCalledWith();
      expect(completeSpy).toHaveBeenCalledWith();
    });
  });
});
