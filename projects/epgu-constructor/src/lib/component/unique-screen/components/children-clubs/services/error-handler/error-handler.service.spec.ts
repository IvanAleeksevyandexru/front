import { TestBed } from '@angular/core/testing';
import {
  LocationService,
  LocationServiceStub,
  LoggerService,
  LoggerServiceStub,
  MicroAppNavigationService,
  MicroAppNavigationServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { PROGRAM_DETAIL_SUB_URL, SEARCH_GROUP_SUB_URL } from '../health/health-handler';
import { COMMON_ERROR_MODAL_PARAMS } from './error-handler.data';
import { ConfirmationModalComponent } from '../../../../../../modal/confirmation-modal/confirmation-modal.component';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let navService: MicroAppNavigationService;
  let modalService: ModalService;
  let locationService: LocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: LoggerService, useClass: LoggerServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: MicroAppNavigationService, useClass: MicroAppNavigationServiceStub },
      ],
    }).compileComponents();
    service = TestBed.inject(ErrorHandlerService);
    navService = TestBed.inject(MicroAppNavigationService);
    modalService = TestBed.inject(ModalService);
    locationService = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleResponseError()', () => {
    let testResponse;

    beforeEach(() => {
      testResponse = ({
        headers: { get: () => null },
        status: 0,
        url: '',
      } as unknown) as HttpErrorResponse;
    });

    it('should return to projectList display', () => {
      testResponse.status = 401;
      testResponse.url = SEARCH_GROUP_SUB_URL;
      const spy = jest.spyOn(navService, 'toDisplay');

      service.handleResponseError(testResponse);

      expect(spy).toHaveBeenCalledWith('projectList');
    });

    it('should return to projectList display', () => {
      testResponse.status = 401;
      testResponse.url = PROGRAM_DETAIL_SUB_URL;
      const spy = jest.spyOn(navService, 'toDisplay');

      service.handleResponseError(testResponse);

      expect(spy).toHaveBeenCalledWith('projectList');
    });

    it('should reload page', () => {
      testResponse.status = 401;
      jest.spyOn(modalService, 'openModal').mockImplementation(() => of('login'));
      const spy = jest.spyOn(locationService, 'reload');

      const res = service.handleResponseError(testResponse);

      res.subscribe(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it('should go to main page', () => {
      testResponse.status = 401;
      jest.spyOn(modalService, 'openModal').mockImplementation(() => of('notlogin'));
      const spy = jest.spyOn(locationService, 'href');

      const res = service.handleResponseError(testResponse);

      res.subscribe(() => {
        expect(spy).toHaveBeenCalled();
      });
    });

    it('should show common error modal', () => {
      testResponse.status = 1;
      const spy = jest.spyOn(modalService, 'openModal');
      const params = COMMON_ERROR_MODAL_PARAMS();

      service.handleResponseError(testResponse);

      expect(spy).toHaveBeenCalledWith(ConfirmationModalComponent, { ...params });
    });
  });
});
