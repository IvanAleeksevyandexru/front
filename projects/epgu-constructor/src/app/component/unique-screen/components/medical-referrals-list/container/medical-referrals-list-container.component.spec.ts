import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from 'ng-bullet';
import { MedicalReferralsListContainerComponent } from './medical-refferals-list-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseModule } from '../../../../../shared/base.module';
import { ScreenPadModule } from '../../../../../shared/components/screen-pad/screen-pad.module';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ConfigService } from '../../../../../core/services/config/config.service';
import { ConfigServiceStub } from '../../../../../core/services/config/config.service.stub';
import { MedicalReferralsListComponent } from '../medical-referrals-list.component';
import { AnswerButtonModule } from '../../../../../shared/components/answer-button/answer-button.module';
import { ModalService } from '../../../../../modal/modal.service';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { ActionType, DTOActionAction } from '@epgu/epgu-constructor-types';
import { ConfirmationModalComponent } from '../../../../../modal/confirmation-modal/confirmation-modal.component';
import { ModalServiceStub } from '../../../../../modal/modal.service.stub';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../core/interceptor/errors/errors.interceptor.constants';
import { of } from 'rxjs';

describe('MedicalReferralsListContainerComponent', () => {
  let component: MedicalReferralsListContainerComponent;
  let fixture: ComponentFixture<MedicalReferralsListContainerComponent>;
  let screenService: ScreenService;
  let currentAnswersService: CurrentAnswersService;
  let actionService: ActionService;
  let modalService: ModalService;

  const mockComponent = {
    id: 'medicalreferrals',
    type: 'MedicalReferrals',
    attrs: {
      answers: [{
        label: 'Найти по номеру направления',
        action: DTOActionAction.getNextStep,
        type: ActionType.nextStep,
        value: ''
      }],
    },
    label: '',
    // eslint-disable-next-line max-len
    value: '{"totalItems":5,"items":[{"parentItem":null,"children":[],"fields":{"itemName":null,"title":null},"attributes":[{"name":"referralId","value":"205206"},{"name":"referralNumber","value":"445"},{"name":"referralTypeId","value":"6"},{"name":"referralStartDate","value":"2020-01-10"},{"name":"referralEndDate","value":"2021-12-31"},{"name":"paymentSourceId","value":"1"},{"name":"toMoOid","value":"1.2.643.5.1.13.13.12.2.16.1179.0.221506"},{"name":"toMoName","value":"Женская консультация, ГАУЗ &quot;Городская поликлиника № 21&quot;"},{"name":"toSpecsId","value":"34"},{"name":"toSpecsName","value":"врач-кардиолог"},{"name":"toResourceName","value":"Пушкина Анна Ивановна"},{"name":"fromMoOid","value":"1.2.643.5.1.13.13.12.2.16.1080.0.368844"},{"name":"fromMoName","value":"Отделение узких специалистов, ГАУЗ &quot;Городская поликлиника №18&quot;"},{"name":"fromSpecsId","value":"109"},{"name":"fromSpecsName","value":"врач-терапевт"},{"name":"fromResourceName","value":"Николаева Яна Семеновна"}]}],"version":"78541488","error":{"errorDetail":{"errorCode":0,"errorMessage":"Operation completed"},"fieldErrors":[]}}',
    required: true,
  };
  const mockButtons = [];

  const mockReferral = {
    referralNumber: '123',
    originalItem: {
      totalItems: 0,
      items: [],
      version: 1,
      error: {}
    }
  };


  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        MedicalReferralsListContainerComponent,
        MockComponent(MedicalReferralsListComponent),
      ],
      imports: [
        MockModule(DefaultUniqueScreenWrapperModule),
        MockModule(BaseModule),
        MockModule(ScreenPadModule),
        MockModule(AnswerButtonModule),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        CurrentAnswersService,
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    currentAnswersService = TestBed.inject(CurrentAnswersService);
    actionService = TestBed.inject(ActionService);
    modalService = TestBed.inject(ModalService);
    screenService.component = mockComponent;
    screenService.buttons = mockButtons as any;
    fixture = TestBed.createComponent(MedicalReferralsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init state', () => {
    jest.useFakeTimers();
    expect(currentAnswersService.isValid).toEqual(true);
    expect(component.action).toEqual(mockComponent.attrs.answers[0]);

    component.medicalReferrals$.subscribe(referrals => {
      const referralsResult = [
        {
          originalItem: JSON.parse(mockComponent.value).items[0],
          referralId: '205206',
          referralNumber: '445',
          referralTypeId: '6',
          referralStartDate: '2020-01-10',
          referralEndDate: '2021-12-31',
          paymentSourceId: '1',
          toMoOid: '1.2.643.5.1.13.13.12.2.16.1179.0.221506',
          toMoName: 'Женская консультация, ГАУЗ &quot;Городская поликлиника № 21&quot;',
          toSpecsId: '34',
          toSpecsName: 'врач-кардиолог',
          toResourceName: 'Пушкина Анна Ивановна',
          fromMoOid: '1.2.643.5.1.13.13.12.2.16.1080.0.368844',
          fromMoName: 'Отделение узких специалистов, ГАУЗ &quot;Городская поликлиника №18&quot;',
          fromSpecsId: '109',
          fromSpecsName: 'врач-терапевт',
          fromResourceName: 'Николаева Яна Семеновна'
        }
      ];

      expect(referrals).toEqual(referralsResult);
    });
    jest.runAllTimers();
  });

  describe('getModalParams()', () => {
    it('get modal params with default message', () => {
      expect(component.getModalParams(null)).toEqual({
        ...COMMON_ERROR_MODAL_PARAMS,
        text: `<div class="text_modal_error">
        <img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
        <h4>Не удалось загрузить список направлений</h4>
        <span>
        Попробуйте снова или зайдите позже. Если ничего не изменится — напишите в
        <a target="_blank" href="https://www.gosuslugi.ru/feedback">службу поддержки</a>.
        </span>
        </div>`,
        buttons: [
          {
            label: 'Закрыть',
            closeModal: true,
            color: 'white',
          },
          {
            label: 'Попробовать ещё раз',
            closeModal: true,
            value: 'reload',
          },
        ],
      });
    });

    it('get modal params with message', () => {
      expect(component.getModalParams('test message')).toEqual({
        ...COMMON_ERROR_MODAL_PARAMS,
        text: `<div class="text_modal_error">
        <img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg">
        <h4>Не удалось загрузить список направлений</h4>
        <span>
        test message
        </span>
        </div>`,
        buttons: [
          {
            label: 'Закрыть',
            closeModal: true,
            color: 'white',
          },
          {
            label: 'Попробовать ещё раз',
            closeModal: true,
            value: 'reload',
          },
        ],
      });
    });
  });

  it('init state (error)', () => {
    jest.useFakeTimers();

    mockComponent.value = '{"totalItems":0,"items":[],"version":"78541488","error":{"errorDetail":{"errorCode":1,"errorMessage":"Operation failed"},"fieldErrors":[]}}';
    fixture.detectChanges();

    jest.spyOn(actionService, 'switchAction');
    jest.spyOn(modalService, 'openModal').mockReturnValue(of(true));

    component.medicalReferrals$.subscribe(referrals => {
      expect(referrals).toEqual(null);
      expect(modalService.openModal)
        .toHaveBeenLastCalledWith(ConfirmationModalComponent, component.getModalParams('Operation failed'));
    });
    expect(currentAnswersService.state).toEqual('retry');
    expect(actionService.switchAction).toHaveBeenCalled();
    jest.runAllTimers();
  });

  it('sendReferral()', () => {
    jest.spyOn(actionService, 'switchAction');
    component.sendReferral(mockReferral as any);

    expect(currentAnswersService.state).toEqual(mockReferral.originalItem);
    expect(actionService.switchAction).toHaveBeenCalled();
  });
});
