import { TestBed } from '@angular/core/testing';
import { ContinueOrderModalService } from './continue-order-modal.service';
import { ModalService } from '../modal.service';
import { ModalServiceStub } from '../modal.service.stub';

describe('ContinueOrderModalService', () => {
  let service: ContinueOrderModalService;
  let modalService: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContinueOrderModalService,
        { provide: ModalService, useClass: ModalServiceStub }
      ]
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
