import { TestBed } from '@angular/core/testing';
import { ContinueOrderModalService } from './continue-order-modal.service';
import {
  DatesToolsService,
  DatesToolsServiceStub,
  ModalService,
  ModalServiceStub,
} from '@epgu/epgu-constructor-ui-kit';

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
      spyOn(modalService, 'openModal').and.callThrough();
      service.openModal();
      expect(modalService.openModal).toBeCalled();
    });
  });
});
