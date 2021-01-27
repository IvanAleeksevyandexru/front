import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { ConstructorCheckboxModule } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.module';
import { ConstructorDadataWidgetModule } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.module';
import { ConstructorDatePickerModule } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.module';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { ConstructorLookupModule } from '../../../../shared/components/constructor-lookup/constructor-lookup.module';
import { ConstructorPlainInputModule } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.module';
import { MaskHandlePipe } from '../../../../shared/pipes/mask-handle/mask-handle.pipe';
import { DictionaryApiService } from '../../services/dictionary-api/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../services/dictionary-api/dictionary-api.service.stub';
import { ComponentsListComponent } from './components-list.component';
import { ComponentListFormService } from './services/component-list-form/component-list-form.service';
// eslint-disable-next-line max-len
import { ConstructorMultilineInputModule } from '../../../../shared/components/constructor-multiline-input/constructor-multiline-input.module';

xdescribe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ComponentsListComponent, MaskHandlePipe],
      providers: [
        { provide: DictionaryApiService, useClass: DictionaryApiServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        ComponentListFormService,
        EventBusService,
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        ConstructorPlainInputModule,
        ConstructorDadataWidgetModule,
        ConstructorDropdownModule,
        ConstructorLookupModule,
        ConstructorCheckboxModule,
        ConstructorDatePickerModule,
        ConstructorMultilineInputModule,
      ],
    });

    TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListComponent);
    component = fixture.componentInstance;
    // fixture.debugElement.injector.get(DictionaryApiService);
    // fixture.debugElement.injector.get(ScreenService);
    // fixture.debugElement.injector.get(ConfigService);
    // fixture.debugElement.injector.get(UnsubscribeService);
    // fixture.debugElement.injector.get(ValidationService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
