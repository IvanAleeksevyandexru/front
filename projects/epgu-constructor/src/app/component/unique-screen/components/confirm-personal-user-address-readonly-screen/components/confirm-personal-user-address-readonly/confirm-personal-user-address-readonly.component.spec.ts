import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { ConfirmAddressInterface } from '../../interface/confirm-address.interface';
import { ConfirmPersonalUserAddressReadonlyComponent } from './confirm-personal-user-address-readonly.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { of } from 'rxjs';
import { UniqueScreenComponentTypes } from '../../../../unique-screen-components.types';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatesToolsService } from '../../../../../../core/services/dates-tools/dates-tools.service';
import { MockComponent, MockDirective, MockModule } from 'ng-mocks';
import { DadataWidgetComponent, DatePickerComponent, PlainInputComponent } from 'epgu-lib';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { configureTestSuite } from 'ng-bullet';
import { ValidationTypeModule } from '../../../../../../shared/directives/validation-type/validation-type.module';
import { TextTransformDirective } from '../../../../../../shared/directives/text-transform/text-transform.directive';
import { LabelComponent } from '../../../../../../shared/components/base-components/label/label.component';
import { HelperTextComponent } from '../../../../../../shared/components/base-components/helper-text/helper-text.component';
import { DefaultUniqueScreenWrapperComponent } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.component';
import { ActionDirective } from '../../../../../../shared/directives/action/action.directive';
import { ActionType, ComponentActionDto } from 'epgu-constructor-types';

describe('ConfirmPersonalUserAddressReadonlyComponent', () => {
  let component: ConfirmPersonalUserAddressReadonlyComponent;
  let screenService: ScreenService;
  let fixture: ComponentFixture<ConfirmPersonalUserAddressReadonlyComponent>;
  const mockData: ConfirmAddressInterface = {
    attrs: {
      actions: [],
      fields: [
        {
          fieldName: 'regAddr',
          label: 'Адрес'
        },
        {
          fieldName: 'regDate',
          label: 'Дата регистрации',
          hint: 'Дату регистрации можно найти на штампе о регистрации на стр. 5-12 паспорта РФ'
        }
      ],
    },
    id: '',
    value: '{}',
    label: '',
    type: UniqueScreenComponentTypes.confirmPersonalUserRegAddr,
    required: false,
    valueFromCache: false,
  };
  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: null,
    type: ActionType.nextStepModal,
  };

  configureTestSuite(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MockModule(ScreenPadModule),
        MockModule(ValidationTypeModule),
      ],
      declarations: [
        ConfirmPersonalUserAddressReadonlyComponent,
        MockComponent(DatePickerComponent),
        MockDirective(TextTransformDirective),
        MockDirective(ActionDirective),
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
        DatesToolsService
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserAddressReadonlyComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    component.data$ = of(mockData);
    fixture.detectChanges();
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
