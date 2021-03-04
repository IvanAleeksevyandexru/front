import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { MockComponents, MockPipe } from 'ng-mocks';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../core/services/config/config.service.stub';
import { EventBusService } from '../../../../core/services/event-bus/event-bus.service';
import { MaskHandlePipe } from '../../../../shared/pipes/mask-handle/mask-handle.pipe';
import { DictionaryApiService } from '../../services/dictionary/dictionary-api.service';
import { DictionaryApiServiceStub } from '../../services/dictionary/dictionary-api.service.stub';
import { ComponentsListComponent } from './components-list.component';
import { ComponentListFormService } from './services/component-list-form/component-list-form.service';
import { ComponentListToolsService } from './services/component-list-tools/component-list-tools.service';
import { DateRangeService } from './services/date-range/date-range.service';
import { ConstructorPlainInputComponent } from '../../../../shared/components/constructor-plain-input/constructor-plain-input.component';
// eslint-disable-next-line max-len
import { ConstructorDadataWidgetComponent } from '../../../../shared/components/constructor-dadata-widget/constructor-dadata-widget.component';
import { ConstructorDropdownComponent } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.component';
import { ConstructorLookupComponent } from '../../../../shared/components/constructor-lookup/constructor-lookup.component';
import { ConstructorCheckboxComponent } from '../../../../shared/components/constructor-checkbox/constructor-checkbox.component';
import { ConstructorDatePickerComponent } from '../../../../shared/components/constructor-date-picker/constructor-date-picker.component';
// eslint-disable-next-line max-len
import { ConstructorMultilineInputComponent } from '../../../../shared/components/constructor-multiline-input/constructor-multiline-input.component';
import { ComponentItemComponent } from './component-item/component-item.component';
import { PassportComponent } from '../../../../shared/components/add-passport/passport.component';
import { DocInputComponent } from './doc-input/doc-input.component';
import { FieldListComponent } from '../../../../shared/components/field-list/field-list.component';
import { OutputHtmlComponent } from '../../../../shared/components/output-html/output-html.component';
import { ValidationService } from '../../../../shared/services/validation/validation.service';
import { ScreenService } from '../../../../screen/screen.service';
import { DatesToolsService } from '../../../../core/services/dates-tools/dates-tools.service';
import { AddressHelperService } from './services/address-helper/address-helper.service';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ValueLoaderService } from '../../../../shared/services/value-loader/value-loader.service';
import { CachedAnswersService } from '../../../../shared/services/cached-answers/cached-answers.service';
import { UtilsService } from '../../../../core/services/utils/utils.service';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { MemoModule } from '../../../../shared/pipes/memo/memo.module';
import { DictionaryToolsService } from '../../services/dictionary/dictionary-tools.service';

// TODO написать тест
describe('ComponentsListComponent', () => {
  let component: ComponentsListComponent;
  let fixture: ComponentFixture<ComponentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MemoModule,
      ],
      declarations: [
        ComponentsListComponent,
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
        EventBusService,
        ValidationService,
        ComponentListToolsService,
        ScreenService,
        ComponentListFormService,
        DateRangeService,
        DatesToolsService,
        AddressHelperService,
        CurrentAnswersService,
        ValueLoaderService,
        CachedAnswersService,
        UtilsService,
        LoggerService,
        DictionaryToolsService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ComponentsListComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
