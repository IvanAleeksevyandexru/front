import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ConfirmPersonalUserAddressComponent } from './confirm-personal-user-address.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { of } from 'rxjs';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { UniqueScreenComponentTypes } from '../../../../unique-screen-components.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { SuggestHandlerService } from '../../../../../../shared/services/suggest-handler/suggest-handler.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { MockComponent, MockDirective, MockModule } from 'ng-mocks';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { ValidationTypeModule } from '../../../../../../shared/directives/validation-type/validation-type.module';
import { AddressItemComponent } from '../address-item/address-item.component';
import { DadataWidgetComponent, DatePickerComponent, PlainInputComponent } from 'epgu-lib';
import { TextTransformDirective } from '../../../../../../shared/directives/text-transform/text-transform.directive';
import { LabelComponent } from '../../../../../../shared/components/base-components/label/label.component';
import { HelperTextComponent } from '../../../../../../shared/components/base-components/helper-text/helper-text.component';
import { DefaultUniqueScreenWrapperComponent } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';

describe('ConfirmPersonalUserAddressComponent', () => {
  let component: ConfirmPersonalUserAddressComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressComponent>;
  const mockData: ConfirmAddressInterface = {
    attrs: {
      actions: [],
      fields: [],
    },
    id: '',
    value: '{}',
    label: '',
    type: UniqueScreenComponentTypes.confirmPersonalUserRegAddr,
    required: false,
    valueFromCache: false,
  };

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MockModule(ScreenPadModule),
        MockModule(ValidationTypeModule),
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule],
      declarations: [
        AddressItemComponent,
        ConfirmPersonalUserAddressComponent,
        MockComponent(DatePickerComponent),
        MockDirective(TextTransformDirective),
        MockComponent(LabelComponent),
        MockComponent(HelperTextComponent),
        MockComponent(DefaultUniqueScreenWrapperComponent),
        MockComponent(DadataWidgetComponent),
        MockComponent(PlainInputComponent)
      ],
      providers: [
        UnsubscribeService,
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        DatesToolsService,
        SuggestHandlerService,
        EventBusService,
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressComponent);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
