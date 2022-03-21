import { TestBed } from '@angular/core/testing';
import {
  DatesToolsService,
  DatesToolsServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { ContinueOrderModalService } from './continue-order-modal.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { OrderDto } from '@epgu/epgu-constructor-types';

describe('ContinueOrderModalService', () => {
  let service: ContinueOrderModalService;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: DatesToolsService, useClass: DatesToolsServiceStub },
        ContinueOrderModalService,
      ],
    });
    service = TestBed.inject(ContinueOrderModalService);
    modalService = TestBed.inject(ModalService);
  });

  describe('openModal', () => {
    it('should call openModal of ModalService', () => {
      const spy = jest.spyOn(modalService, 'openModal');
      service.openModal();
      expect(spy).toBeCalled();
    });
  });

  describe('openSelectOrderModal', () => {
    const defaultLimitedCaseText = `<div><img style="display:block; margin: 24px auto"
      src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
      <h4 style="text-align: center">У вас есть черновики заявления</h4>
      <p class="helper-text" style="text-align: center; margin-top: 8px;">
      Выберите черновик для редактирования или создайте новое заявление</p></div>`;

    const defaultText = `<div><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/order_80.svg">
      <h4 style="text-align: center">У вас есть черновики заявления</h4>
      <p class="helper-text" style="text-align: center; margin-top: 8px;">
      Выберите черновик для редактирования или создайте новое заявление</p></div>`;

    const newOrderButton = {
      label: 'Создать новое заявление',
      hint: '',
      value: '',
      type: '',
      action: '',
    };

    it('should use limited case text', () => {
      const spy = jest.spyOn(modalService, 'openModal');

      service.openSelectOrderModal([], 0);

      expect(spy).toBeCalledWith(ConfirmationModalComponent, {
        backdropDismiss: false,
        text: defaultLimitedCaseText,
        showCloseButton: false,
        showCrossButton: true,
        isShortModal: false,
        answerButtons: [],
      });
    });

    it('should use default text and add new order button', () => {
      const spy = jest.spyOn(modalService, 'openModal');

      service.openSelectOrderModal([], 1);

      expect(spy).toBeCalledWith(ConfirmationModalComponent, {
        backdropDismiss: false,
        text: defaultText,
        showCloseButton: false,
        showCrossButton: true,
        isShortModal: false,
        answerButtons: [newOrderButton],
      });
    });

    it('should add button with correct params to result', () => {
      const testButton = {
        label: 'Москва',
        description: '12 декабря | №1',
        value: '1',
        type: '',
        action: '',
      };
      const spy = jest.spyOn(modalService, 'openModal');
      jest.spyOn(service['datesToolsService'], 'format').mockReturnValue('12 декабря');
      const order: OrderDto = {
        id: 1,
        createdAt: '12.12.12',
        region: '45000000000',
        orderId: 7,
      };

      service.openSelectOrderModal([order], 0);

      expect(spy).toBeCalledWith(ConfirmationModalComponent, {
        backdropDismiss: false,
        text: defaultLimitedCaseText,
        showCloseButton: false,
        showCrossButton: true,
        isShortModal: false,
        answerButtons: [testButton],
      });
    });

    it('should add button with correct label to result', () => {
      const testButton = {
        label: 'НеМосква',
        description: '12 декабря | №1',
        value: '1',
        type: '',
        action: '',
      };
      const spy = jest.spyOn(modalService, 'openModal');
      jest.spyOn(service['datesToolsService'], 'format').mockReturnValue('12 декабря');
      const order: OrderDto = {
        id: 1,
        createdAt: '12.12.12',
        region: '45000000000',
        orderId: 7,
        name: 'НеМосква',
      };

      service.openSelectOrderModal([order], 0);

      expect(spy).toBeCalledWith(ConfirmationModalComponent, {
        backdropDismiss: false,
        text: defaultLimitedCaseText,
        showCloseButton: false,
        showCrossButton: true,
        isShortModal: false,
        answerButtons: [testButton],
      });
    });

    it('should add button with correct label to result', () => {
      const testButton = {
        label: 'Киев',
        description: '12 декабря | №1',
        value: '1',
        type: '',
        action: '',
      };
      const spy = jest.spyOn(modalService, 'openModal');
      jest.spyOn(service['datesToolsService'], 'format').mockReturnValue('12 декабря');
      const order: OrderDto = {
        id: 1,
        createdAt: '12.12.12',
        region: 'Киев',
        orderId: 7,
      };

      service.openSelectOrderModal([order], 0);

      expect(spy).toBeCalledWith(ConfirmationModalComponent, {
        backdropDismiss: false,
        text: defaultLimitedCaseText,
        showCloseButton: false,
        showCrossButton: true,
        isShortModal: false,
        answerButtons: [testButton],
      });
    });
  });
});
