import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ConfigService,
  ConfigServiceStub,
  UnsubscribeService,
  UnsubscribeServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';
import { By } from '@angular/platform-browser';
import { ConfirmPersonalPolicyComponent } from './confirm-personal-policy.component';
import { ConfirmPolicyError, PersonalPolicyWithErrors } from './confirm-personal-policy.types';
import { JsonHelperService } from '../../../../core/services/json-helper/json-helper.service';
import { JsonHelperServiceStub } from '../../../../core/services/json-helper/json-helper.service.stub';

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
    },
    id: '',
    label: '',
    type: '',
    value: '{"series":"","number":"2515093164354727"}',
    errors: [],
  };
  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: DTOActionAction.editUserPolicy,
    type: ActionType.nextStepModal,
  };

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
    fixture.detectChanges();

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.type).toEqual('warn');
    expect(debugEl.nativeElement.description).toEqual('description');
  });

  it('should rendered correctly view state without errors', () => {
    mockData.errors = [];
    screenService.component = mockData;
    fixture.detectChanges();

    const selector = 'epgu-constructor-disclaimer';
    const debugEl: DebugElement = fixture.debugElement.query(By.css(selector));
    expect(debugEl.nativeElement.type).toEqual('warn');
    expect(debugEl.nativeElement.description).toEqual('description');
  });
});
