import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule } from 'ng-mocks';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MedicalReferralsListContainerComponent } from './medical-refferals-list-container.component';
import { ScreenService } from '../../../../../screen/screen.service';
import { DefaultUniqueScreenWrapperModule } from '../../../shared/default-unique-screen-wrapper/default-unique-screen-wrapper.module';
import { BaseModule } from '../../../../../shared/base.module';
import { ScreenPadModule } from '@epgu/epgu-constructor-ui-kit';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenServiceStub } from '../../../../../screen/screen.service.stub';
import { ConfigService } from '@epgu/epgu-constructor-ui-kit';
import { ConfigServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { MedicalReferralsListComponent } from '../medical-referrals-list.component';
import { AnswerButtonModule } from '../../../../../shared/components/answer-button/answer-button.module';
import { ModalService, ModalServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { ActionService } from '../../../../../shared/directives/action/action.service';
import { ActionType, DTOActionAction } from '@epgu/epgu-constructor-types';
import { COMMON_ERROR_MODAL_PARAMS } from '../../../../../core/services/error-handler/error-handler';
import { of } from 'rxjs';
import { ConfirmationModalComponent } from '../../../../../modal/confirmation-modal/confirmation-modal.component';

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
    attrs: {},
    arguments: {},
    label: '',
    value:
      // eslint-disable-next-line max-len
      '{"medicalInfo":"{\\"smevVersion\\":3,\\"sessionId\\":\\"9c8f6834-7ddf-4a0d-ac2d-f650ba3a9734\\",\\"eserviceId\\":\\"10000025167\\",\\"medicalData\\":{\\"totalItems\\":5,\\"items\\":[{\\"children\\":[],\\"fields\\":{}, \\"convertedAttributes\\": { \\"referralId\\":\\"205206\\", \\"referralNumber\\":\\"445\\" }, \\"attributes\\":[{\\"name\\":\\"referralId\\",\\"value\\":\\"205206\\"},{\\"name\\":\\"referralNumber\\",\\"value\\":\\"445\\"},{\\"name\\":\\"referralTypeId\\",\\"value\\":\\"6\\"},{\\"name\\":\\"referralStartDate\\",\\"value\\":\\"2020-01-10\\"},{\\"name\\":\\"referralEndDate\\",\\"value\\":\\"2021-12-31\\"},{\\"name\\":\\"paymentSourceId\\",\\"value\\":\\"1\\"},{\\"name\\":\\"toMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.16.1179.0.221506\\"},{\\"name\\":\\"toMoName\\",\\"value\\":\\"Женская консультация, ГАУЗ &quot;Городская поликлиника № 21&quot;\\"},{\\"name\\":\\"toSpecsId\\",\\"value\\":\\"34\\"},{\\"name\\":\\"toSpecsName\\",\\"value\\":\\"врач-кардиолог\\"},{\\"name\\":\\"toResourceName\\",\\"value\\":\\"Пушкина Анна Ивановна\\"},{\\"name\\":\\"fromMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.16.1080.0.368844\\"},{\\"name\\":\\"fromMoName\\",\\"value\\":\\"Отделение узких специалистов, ГАУЗ &quot;Городская поликлиника №18&quot;\\"},{\\"name\\":\\"fromSpecsId\\",\\"value\\":\\"109\\"},{\\"name\\":\\"fromSpecsName\\",\\"value\\":\\"врач-терапевт\\"},{\\"name\\":\\"fromResourceName\\",\\"value\\":\\"Николаева Яна Семеновна\\"}]},{\\"children\\":[],\\"fields\\":{}, \\"attributes\\":[{\\"name\\":\\"referralId\\",\\"value\\":\\"206789\\"},{\\"name\\":\\"referralNumber\\",\\"value\\":\\"558\\"},{\\"name\\":\\"referralTypeId\\",\\"value\\":\\"8\\"},{\\"name\\":\\"referralStartDate\\",\\"value\\":\\"2020-01-10\\"},{\\"name\\":\\"referralEndDate\\",\\"value\\":\\"2021-12-31\\"},{\\"name\\":\\"paymentSourceId\\",\\"value\\":\\"1\\"},{\\"name\\":\\"toMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.16.1179.0.221506\\"},{\\"name\\":\\"toMoName\\",\\"value\\":\\"Женская консультация, ГАУЗ &quot;Городская поликлиника № 21&quot;\\"},{\\"name\\":\\"toSpecsId\\",\\"value\\":\\"53\\"},{\\"name\\":\\"toSpecsName\\",\\"value\\":\\"врач-оториноларинголог\\"},{\\"name\\":\\"toResourceName\\",\\"value\\":\\"Нестерова Карина Ивановна\\"},{\\"name\\":\\"fromMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.16.1080.0.368844\\"},{\\"name\\":\\"fromMoName\\",\\"value\\":\\"Отделение узких специалистов, ГАУЗ &quot;Городская поликлиника №18&quot;\\"},{\\"name\\":\\"fromSpecsId\\",\\"value\\":\\"109\\"},{\\"name\\":\\"fromSpecsName\\",\\"value\\":\\"врач-терапевт\\"},{\\"name\\":\\"fromResourceName\\",\\"value\\":\\"Иванов Петр Иванович\\"},{\\"name\\":\\"toServiceId\\",\\"value\\":\\"A16.08.010.001\\"},{\\"name\\":\\"toServiceName\\",\\"value\\":\\"Подслизистая вазотомия нижних носовых раковин\\"}]},{\\"children\\":[],\\"fields\\":{},\\"attributes\\":[{\\"name\\":\\"referralId\\",\\"value\\":\\"335335\\"},{\\"name\\":\\"referralNumber\\",\\"value\\":\\"335\\"},{\\"name\\":\\"referralTypeId\\",\\"value\\":\\"6\\"},{\\"name\\":\\"referralStartDate\\",\\"value\\":\\"2020-01-10\\"},{\\"name\\":\\"referralEndDate\\",\\"value\\":\\"2021-12-31\\"},{\\"name\\":\\"paymentSourceId\\",\\"value\\":\\"1\\"},{\\"name\\":\\"toSpecsId\\",\\"value\\":\\"13\\"},{\\"name\\":\\"toSpecsName\\",\\"value\\":\\"врач-акушер-гинеколог\\"},{\\"name\\":\\"toResourceName\\",\\"value\\":\\"Куприянова Ирина Семеновна\\"},{\\"name\\":\\"fromMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.16.1080.0.368844\\"},{\\"name\\":\\"fromMoName\\",\\"value\\":\\"Отделение узких специалистов, ГАУЗ &quot;Городская поликлиника №18&quot;\\"},{\\"name\\":\\"fromSpecsId\\",\\"value\\":\\"109\\"},{\\"name\\":\\"fromSpecsName\\",\\"value\\":\\"врач-терапевт\\"},{\\"name\\":\\"fromResourceName\\",\\"value\\":\\"Николаева Яна Семеновна\\"}]},{\\"children\\":[],\\"fields\\":{},\\"attributes\\":[{\\"name\\":\\"referralId\\",\\"value\\":\\"55544433\\"},{\\"name\\":\\"referralNumber\\",\\"value\\":\\"1589\\"},{\\"name\\":\\"referralTypeId\\",\\"value\\":\\"4\\"},{\\"name\\":\\"referralStartDate\\",\\"value\\":\\"2020-06-30\\"},{\\"name\\":\\"referralEndDate\\",\\"value\\":\\"2022-09-30\\"},{\\"name\\":\\"paymentSourceId\\",\\"value\\":\\"1\\"},{\\"name\\":\\"toMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.59.6018.0.74664\\"},{\\"name\\":\\"toMoName\\",\\"value\\":\\"Поликлиника №1, ГБУЗ ПК &quot; ГКП №4&quot;\\"},{\\"name\\":\\"fromMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.59.10097.0.273023\\"},{\\"name\\":\\"fromMoName\\",\\"value\\":\\"Поликлиника №1, ГБУЗ ПК &quot;ГП №7&quot;\\"},{\\"name\\":\\"fromSpecsId\\",\\"value\\":\\"34\\"},{\\"name\\":\\"fromSpecsName\\",\\"value\\":\\"врач-кардиолог\\"},{\\"name\\":\\"fromResourceName\\",\\"value\\":\\"Пушнина Любовь Аркадьевна\\"},{\\"name\\":\\"toServiceId\\",\\"value\\":\\"A04.10.002.010\\"},{\\"name\\":\\"toServiceName\\",\\"value\\":\\"Эхокардиография с допплерографией\\"}]},{\\"children\\":[],\\"fields\\":{},\\"attributes\\":[{\\"name\\":\\"referralId\\",\\"value\\":\\"5554443322\\"},{\\"name\\":\\"referralNumber\\",\\"value\\":\\"158922\\"},{\\"name\\":\\"referralTypeId\\",\\"value\\":\\"4\\"},{\\"name\\":\\"referralStartDate\\",\\"value\\":\\"2020-06-30\\"},{\\"name\\":\\"referralEndDate\\",\\"value\\":\\"2022-09-30\\"},{\\"name\\":\\"paymentSourceId\\",\\"value\\":\\"1\\"},{\\"name\\":\\"toMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.59.6018.0.74664\\"},{\\"name\\":\\"toMoName\\",\\"value\\":\\"Поликлиника №1, ГБУЗ ПК &quot; ГКП №4&quot;\\"},{\\"name\\":\\"toSpecsId\\",\\"value\\":\\"13\\"},{\\"name\\":\\"toSpecsName\\",\\"value\\":\\"врач-акушер-гинеколог\\"},{\\"name\\":\\"fromMoOid\\",\\"value\\":\\"1.2.643.5.1.13.13.12.2.59.10097.0.273023\\"},{\\"name\\":\\"fromMoName\\",\\"value\\":\\"Поликлиника №1, ГБУЗ ПК &quot;ГП №7&quot;\\"},{\\"name\\":\\"fromSpecsId\\",\\"value\\":\\"34\\"},{\\"name\\":\\"fromSpecsName\\",\\"value\\":\\"врач-кардиолог\\"},{\\"name\\":\\"fromResourceName\\",\\"value\\":\\"Пушнина Любовь Аркадьевна\\"}]}],\\"version\\":\\"78541488\\",\\"error\\":{\\"errorDetail\\":{\\"errorCode\\":0,\\"errorMessage\\":\\"Operation completed\\"},\\"fieldErrors\\":[]}}}","buttonLabel":""}',
    required: true,
  };
  const mockButton = {
    label: 'Найти по номеру направления',
    action: DTOActionAction.getNextStep,
    type: ActionType.nextStep,
    value: '',
  };

  const mockReferral = {
    referralNumber: '123',
    originalItem: {
      totalItems: 0,
      items: [],
      version: 1,
      error: {},
    },
  };

  beforeEach(() => {
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
    screenService.button = mockButton as any;
    fixture = TestBed.createComponent(MedicalReferralsListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('init state', () => {
    jest.useFakeTimers();

    component.medicalReferralsInfo$.subscribe((referralsInfo) => {
      const referralResult = {
        originalItem: JSON.parse(JSON.parse(mockComponent.value).medicalInfo).medicalData.items[0],
        referralId: '205206',
        referralNumber: '445',
      };

      expect(currentAnswersService.isValid).toEqual(true);
      expect(component.screenButton).toEqual(mockButton);
      expect(referralsInfo.referrals[0]).toEqual(referralResult);
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

    screenService.component.value =
      // eslint-disable-next-line max-len
      '{"medicalInfo":"{\\"smevVersion\\":3,\\"sessionId\\":\\"9c8f6834-7ddf-4a0d-ac2d-f650ba3a9734\\",\\"eserviceId\\":\\"10000025167\\",\\"medicalData\\":{\\"totalItems\\":5,\\"items\\":[],\\"version\\":\\"78541488\\",\\"error\\":{\\"errorDetail\\":{\\"errorCode\\":1,\\"errorMessage\\":\\"Operation failed\\"},\\"fieldErrors\\":[]}}}","buttonLabel":""}';
    fixture.detectChanges();

    jest.spyOn(actionService, 'switchAction');
    jest.spyOn(modalService, 'openModal').mockReturnValue(of(true));

    component.medicalReferralsInfo$.subscribe((referrals) => {
      expect(referrals.referrals).toEqual(null);
      expect(modalService.openModal).toHaveBeenLastCalledWith(
        ConfirmationModalComponent,
        component.getModalParams('Operation failed'),
      );
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
