import { TestBed } from '@angular/core/testing';
import {
  LocationService,
  LocationServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

import { InterceptorUtilsService } from './interceptor-utils.service';

import { NavigationService } from '../navigation/navigation.service';
import { NavigationServiceStub } from '../navigation/navigation.service.stub';
import { FormPlayerService } from '../../../form-player/services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../../form-player/services/form-player/form-player.service.stub';
import { ConfirmationModal, ErrorModal } from '@epgu/epgu-constructor-types';
import { ConfirmationModalComponent } from '../../../modal/confirmation-modal/confirmation-modal.component';

const errorModal = ({
  content: {
    statusIcon: 'warning',
    header: 'header',
    helperText: 'helperText',
  },
  hideTraceId: true,
} as unknown) as ErrorModal;

const testResult = {
  ...errorModal,
  text:
    // eslint-disable-next-line max-len
    '<div class="text_modal_error"><img style="display:block; margin: 24px auto" src="{staticDomainAssetsPath}/assets/icons/svg/warn.svg"><h4>header</h4><span>helperText</span></div>',
};

describe('InterceptorUtilsService', () => {
  let service: InterceptorUtilsService;
  let location: LocationService;
  let navigation: NavigationService;
  let formPlayer: FormPlayerService;
  let modal: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InterceptorUtilsService,
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(InterceptorUtilsService);
    location = TestBed.inject(LocationService);
    modal = TestBed.inject(ModalService);
    navigation = TestBed.inject(NavigationService);
    formPlayer = TestBed.inject(FormPlayerService);
  });

  it('should be getConfirmationModalParamsFromErrorModalParams', () => {
    expect(
      service.getConfirmationModalParamsFromErrorModalParams((errorModal as unknown) as ErrorModal),
    ).toEqual(testResult);
  });

  it('should be handleModalAction', () => {
    jest.spyOn(formPlayer, 'initData');
    jest.spyOn(navigation, 'prev');
    jest.spyOn(navigation, 'redirectToLK');
    jest.spyOn(location, 'reload');

    service.handleModalAction('init');
    expect(formPlayer.initData).toHaveBeenCalled();
    service.handleModalAction('prevStep');
    expect(navigation.prev).toHaveBeenCalled();

    service.handleModalAction('redirectToLk');
    expect(navigation.redirectToLK).toHaveBeenCalled();

    service.handleModalAction('reload');
    expect(location.reload).toHaveBeenCalled();
  });

  it('should be showModal', () => {
    jest.spyOn(modal, 'openModal');

    service.showModal({ test: 1 } as unknown, '2');
    expect(modal.openModal).toHaveBeenCalledWith(ConfirmationModalComponent, {
      test: 1,
      traceId: '2',
    });
  });

  it('should be showErrorModal', () => {
    jest.spyOn(modal, 'openModal');

    service.showErrorModal(errorModal);
    expect(modal.openModal).toHaveBeenCalledWith(ConfirmationModalComponent, testResult);
  });

  it('should be getStaticErrorMessage', () => {
    expect(
      service.getStaticErrorMessage(
        ({ text: 'n{textAsset}' } as unknown) as ConfirmationModal,
        'FAILURE:1UNKNOWN_REQUEST_DESCRIPTION:2NO_DATA:3',
      ),
    ).toBe('n123');
  });
});
