import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  UnsubscribeService,
  UnsubscribeServiceStub,
  JsonHelperService,
  JsonHelperServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';
import { By } from '@angular/platform-browser';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { ConfirmPersonalPolicyComponent } from './confirm-personal-policy.component';
import { ConfirmPolicyError, PersonalPolicyWithErrors } from './confirm-personal-policy.types';
import { of } from 'rxjs';

describe('ConfirmPersonalPolicyComponent', () => {
  let component: ConfirmPersonalPolicyComponent;
  let fixture: ComponentFixture<ConfirmPersonalPolicyComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;
  const mockData: PersonalPolicyWithErrors = {
    attrs: {
      disclaimer: {
        type: 'warn',
        title: 'Нашли ошибку?',
        description: 'description',
      },
      fields: [
        {
          fieldName: 'series',
          label: 'Серия полиса ОМС',
          required: true,
        },
        {
          fieldName: 'number',
          label: 'Номер полиса ОМС1',
          required: true,
        },
      ],
    },
    id: '',
    label: '',
    type: '',
    value: {
      storedValues: {
        series: '',
        number: '3575134621310480',
      },
      errors: [],
    },
    errors: [],
  };
  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editUserPolicy,
    type: ActionType.nextStepModal,
  };
  const preparedFields = [
    {
      fieldName: 'series',
      label: 'Серия полиса ОМС',
      required: true,
      value: '',
    },
    {
      fieldName: 'number',
      label: 'Номер полиса ОМС1',
      required: true,
      value: '3575134621310480',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ConfirmPersonalPolicyComponent, ActionDirective],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: JsonHelperService, useClass: JsonHelperServiceStub },
        { provide: UnsubscribeService, useClass: UnsubscribeServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalPolicyComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService.component = mockData;
    fixture.detectChanges();
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock);
    jest.spyOn(screenService, 'component$', 'get').mockReturnValue(of(mockData));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rendered correctly view state with errors', () => {
    mockData.errors = [
      {
        type: 'warn',
        title: 'title',
        desc: 'description',
      } as ConfirmPolicyError,
    ];
    screenService.component = mockData;
    component.ngOnInit();
    fixture.detectChanges();

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.type).toEqual('warn');
    expect(debugEl.nativeElement.description).toEqual('description');
  });

  it('should rendered correctly view state without errors', () => {
    mockData.value = {
      storedValues: {
        series: '343423',
        number: '3575134621310480',
      },
      errors: [],
    };
    screenService.component = mockData;
    fixture.detectChanges();

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl.nativeElement.type).toEqual('warn');
    expect(debugEl.nativeElement.description).toEqual('description');
  });

  it('should set correct fields', () => {
    mockData.value = {
      storedValues: {
        series: '',
        number: '3575134621310480',
      },
      errors: [],
    };
    component.ngOnInit();

    expect(component.fields).toEqual(preparedFields);
  });

  it('should set correct errors', () => {
    const mockErrors = [
      {
        title: 'title',
      },
    ];
    mockData.errors = mockErrors;
    component.ngOnInit();

    expect(component.errors).toEqual(mockErrors);

    mockData.errors = [];
    mockData.value.errors = mockErrors;
    component.ngOnInit();

    expect(component.errors).toEqual(mockData.value.errors);
  });
});
