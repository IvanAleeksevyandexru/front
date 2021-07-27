import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatPhonePipe } from '@epgu/epgu-lib';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ScreenService } from '../../../../screen/screen.service';
import { ScreenServiceStub } from '../../../../screen/screen.service.stub';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { ConfirmPersonalUserPhoneEmailComponent } from './confirm-personal-user-phone-email.component';
import { ActionDirective } from '../../../../shared/directives/action/action.directive';
import { UnsubscribeService } from '@epgu/epgu-constructor-ui-kit';
import { UniqueScreenComponentTypes } from '../../unique-screen-components.types';
import { configureTestSuite } from 'ng-bullet';
import { ActionType, ComponentActionDto, DTOActionAction } from '@epgu/epgu-constructor-types';

describe('ConfirmPersonalUserPhoneEmailComponent', () => {
  let component: ConfirmPersonalUserPhoneEmailComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneEmailComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;
  const mockData: ComponentBase = {
    attrs: {},
    id: '',
    label: '',
    type: '',
    value: '',
  };
  const actionMock: ComponentActionDto = {
    label: '',
    value: '',
    action: null,
    type: ActionType.nextStepModal,
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ConfirmPersonalUserPhoneEmailComponent, FormatPhonePipe, ActionDirective],
      providers: [
        CurrentAnswersService,
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneEmailComponent);
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

  describe('updateValue()', () => {
    it('should update value', () => {
      component.updateValue('test@gmail.com', []);

      expect(currentAnswersService.isValid).toEqual(true);
      expect(currentAnswersService.state).toEqual('test@gmail.com');
    });

    it('shouldn\'t update value', () => {
      component.updateValue(null, []);

      expect(currentAnswersService.isValid).toEqual(false);
      expect(currentAnswersService.state).toEqual(undefined);
    });
  });

  describe('ngOnInit()', () => {
    it('should set initial state', () => {
      const updateValue = spyOn(component, 'updateValue');
      component.ngOnInit();
      expect(updateValue).toHaveBeenCalled();
    });

    it('should set isPhoneScreenType for confirmPersonalUserPhone', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ type: UniqueScreenComponentTypes.confirmPersonalUserPhone } as any);
      component.ngOnInit();
      expect(component.isPhoneScreenType).toEqual(true);
    });

    it('should set isPhoneScreenType for confirmLegalPhone', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ type: UniqueScreenComponentTypes.confirmLegalPhone } as any);
      component.ngOnInit();
      expect(component.isPhoneScreenType).toEqual(true);
    });

    it('should set isPhoneScreenType as false', () => {
      jest
        .spyOn(screenService, 'component', 'get')
        .mockReturnValue({ type: UniqueScreenComponentTypes.confirmPersonalUserEmail } as any);
      component.ngOnInit();
      expect(component.isPhoneScreenType).toEqual(false);
    });
  });
});
