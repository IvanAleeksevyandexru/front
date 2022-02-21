import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponents, MockPipe, MockProvider } from 'ng-mocks';
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
  UnsubscribeService,
  LocalStorageService,
  LocalStorageServiceStub,
  HttpCancelService,
  EventBusServiceStub,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ComponentItemComponent } from './components/component-item/component-item.component';
import { ComponentsListComponent } from './components-list.component';
import { ComponentsListFormService } from './services/components-list-form/components-list-form.service';
import { ComponentsListFormServiceStub } from './services/components-list-form/components-list-form.service.stub';
import { ConstructorDadataWidgetComponent } from '../../shared/components/constructor-dadata-widget/constructor-dadata-widget.component';
import { ConstructorDatePickerComponent } from '../../shared/components/constructor-date-picker/constructor-date-picker.component';
import { ConstructorMultilineInputComponent } from '../../shared/components/constructor-multiline-input/constructor-multiline-input.component';
import { ConstructorPlainInputComponent } from '../../shared/components/constructor-plain-input/constructor-plain-input.component';
import { DateRangeService } from '../../shared/services/date-range/date-range.service';
import { DateRestrictionsService } from '../../shared/services/date-restrictions/date-restrictions.service';
import { DocInputComponent } from './components/doc-input/doc-input.component';
import { FieldListComponent } from '../../shared/components/field-list/field-list.component';
import { OutputHtmlComponent } from '../../shared/components/output-html/output-html.component';
import { PassportComponent } from '../../shared/components/add-passport/passport.component';
import { PrepareComponentsService } from '../../shared/services/prepare-components/prepare-components.service';
import { ShowComponentPipe } from './show-component/show-component.pipe';
import { SuggestHandlerService } from '../../shared/services/suggest-handler/suggest-handler.service';
import { ValidationService } from '../../shared/services/validation/validation.service';
import { mockComponentsListComponentStore } from './mocks/mock-components-list';
import { ValidationServiceStub } from '../../shared/services/validation/validation.service.stub';

describe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;
  let eventBusService: EventBusService;
  let httpCancelService: HttpCancelService;
  let unsubscribeService: UnsubscribeService;

  beforeEach(() => {
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
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        { provide: ValidationService, useClass: ValidationServiceStub },
        { provide: EventBusService, useClass: EventBusServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
        MockProvider(DateRestrictionsService),
        MockProvider(HttpCancelService),
        MockProvider(PrepareComponentsService),
        MockProvider(SuggestHandlerService),
        MockProvider(DateRangeService),
      ],
    })
      .overrideComponent(ComponentsListComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default,
          providers: [],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    eventBusService = TestBed.inject(EventBusService);
    httpCancelService = TestBed.inject(HttpCancelService);
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

      component.ngOnInit();

      expect(eventBusServiceSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges()', () => {
    it('should call methods inside itself', () => {
      const unsubscribeSpy = jest.spyOn<ComponentsListComponent, any>(component, 'unsubscribe');
      const subscribeOnFormStatusChangingSpy = jest.spyOn<ComponentsListComponent, any>(
        component,
        'subscribeOnFormStatusChanging',
      );

      component.ngOnChanges({});

      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(subscribeOnFormStatusChangingSpy).toHaveBeenCalled();
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
      const nextSpy = jest.spyOn(unsubscribeService.ngUnsubscribe$, 'next');
      const completeSpy = jest.spyOn(unsubscribeService.ngUnsubscribe$, 'complete');

      component['unsubscribe']();

      expect(nextSpy).toHaveBeenCalledWith();
      expect(completeSpy).toHaveBeenCalledWith();
    });
  });
});
