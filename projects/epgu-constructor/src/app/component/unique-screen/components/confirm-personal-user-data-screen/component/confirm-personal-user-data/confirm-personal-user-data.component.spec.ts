import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockModule } from 'ng-mocks';

import { ConfigService } from '../../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../../core/services/config/config.service.stub';
import { CurrentAnswersService } from '../../../../../../screen/current-answers.service';
import { ConfirmUserData, ConfirmUserDataErrorType } from '../../confirm-personal-user-data-screen.types';
import { ConfirmPersonalUserDataComponent } from './confirm-personal-user-data.component';
import { ScreenService } from '../../../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../../../screen/screen.service.stub';
import { OutputHtmlModule } from '../../../../../../shared/components/output-html/output-html.module';
import { DefaultUniqueScreenWrapperModule } from '../../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseComponentsModule } from '../../../../../../shared/components/base-components/base-components.module';
import { BaseModule } from '../../../../../../shared/base.module';
import { FieldListModule } from '../../../../../../shared/components/field-list/field-list.module';
import { ScreenPadModule } from '../../../../../../shared/components/screen-pad/screen-pad.module';
import { ChangeDetectionStrategy } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActionDirective } from '../../../../../../shared/directives/action/action.directive';
import { configureTestSuite } from 'ng-bullet';
import { ActionType, ComponentActionDto, DTOActionAction } from 'epgu-constructor-types';

const componentMock: ConfirmUserData = {
  attrs: {
    actions: [
      {
        label: '',
        value: '',
        action: DTOActionAction.getNextStep,
      },
    ],
    fields: [
      {
        fieldName: 'birthDate',
        label: 'Birthday Date',
      },
    ],
    style: {
      divider: '',
      list: '',
      field: '',
      group: '',
      groupTitle: '',
      label: '',
      value: '',
    },
  },
  type: '',
  value: '{}',
  presetValue: '{}',
  label: '',
  id: '',
};
const actionMock = {
  label: '',
  value: '',
  action: '',
  type: ActionType.nextStep,
};

describe('ConfirmPersonalUserDataComponent', () => {
  let component: ConfirmPersonalUserDataComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataComponent>;
  let screenService: ScreenServiceStub;
  let currentAnswersService: CurrentAnswersService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmPersonalUserDataComponent],
      imports: [
        MockModule(OutputHtmlModule),
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(BaseComponentsModule),
        MockModule(BaseModule),
        MockModule(FieldListModule),
        MockModule(ScreenPadModule),
      ],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
      ],
    })
      .overrideComponent(ConfirmPersonalUserDataComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService) as unknown as ScreenServiceStub;
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    screenService.component = componentMock;
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionMock as any);
  });

  describe('update value', () => {
    it('currentAnswersService.state should be component.value', () => {
      screenService.component = {
        ...componentMock,
        value: '{"foo": "bar"}',
      };
      fixture.detectChanges();

      expect(currentAnswersService.state).toBe('{"foo": "bar"}');
    });

    it('should update currentAnswersService.isValid should be TRUE if has ConfirmUserDataErrorType error in component.value', () => {
      // потому что component.value еще не определен
      expect(currentAnswersService.isValid).toBeFalsy();

      screenService.component = {
        ...componentMock,
        value: '{"foo": "bar"}',
      };
      fixture.detectChanges();

      // потому что в component.value нет массива errors
      expect(currentAnswersService.isValid).toBeTruthy();

      screenService.component = {
        ...componentMock,
        value: JSON.stringify({
          errors: [
            {
              type: 'someType'
            }
          ]
        })
      };
      fixture.detectChanges();

      // потому что в массиве errors нет ошибки с типом ConfirmUserDataErrorType
      expect(currentAnswersService.isValid).toBeTruthy();

      screenService.component = {
        ...componentMock,
        value: JSON.stringify({
          errors: [
            {
              type: ConfirmUserDataErrorType.error
            }
          ]
        })
      };
      fixture.detectChanges();

      expect(currentAnswersService.isValid).toBeFalsy();
    });
  });

  it('should render epgu-constructor-default-unique-screen-wrapper', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.header).toBeUndefined();
    expect(debugEl.componentInstance.isLoading).toBeFalsy();
    expect(debugEl.componentInstance.screenActionButtons).toBeUndefined();
    expect(debugEl.componentInstance.actionButtons).toBeUndefined();
    expect(debugEl.componentInstance.isShowActionBtn).toBeFalsy();
    expect(debugEl.componentInstance.showNav).toBeFalsy();
    expect(debugEl.componentInstance.isValid).toBeFalsy();

    screenService.header = 'some header';
    screenService.isLoadingSubject.next(true);
    screenService.buttons = [
      {
        label: 'some screen action label'
      }
    ] as ComponentActionDto[];
    screenService.actions = [
      {
        label: 'some action label'
      }
    ] as ComponentActionDto[];

    const buttons = [{ label: 'some submit label', action: DTOActionAction.getNextStep }];

    screenService.showNav = true;
    screenService.buttons = buttons;
    currentAnswersService.isValid = true;
    fixture.detectChanges();

    expect(debugEl.componentInstance.header).toBe('some header');
    expect(debugEl.componentInstance.isLoading).toBeTruthy();
    expect(debugEl.componentInstance.screenButtons).toEqual(buttons);
    expect(debugEl.componentInstance.showNav).toBeTruthy();
    expect(debugEl.componentInstance.isValid).toBeTruthy();
  });

  it('should render epgu-constructor-screen-pad', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper epgu-constructor-screen-pad';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-field-list', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper epgu-constructor-field-list';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.component = componentMock;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBe(componentMock);
  });

  it('should render action button if type is ActionType.profileEdit', () => {
    const selector = 'epgu-constructor-default-unique-screen-wrapper [epgu-constructor-action]';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    const actionSample = {
      label: 'some screen action label',
      type: ActionType.profileEdit
    } as ComponentActionDto;

    screenService.action = actionSample;
    jest.spyOn(screenService, 'action', 'get').mockReturnValue(actionSample);
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
    expect(debugEl.injector.get(ActionDirective).action).toBe(actionSample);
  });
});
