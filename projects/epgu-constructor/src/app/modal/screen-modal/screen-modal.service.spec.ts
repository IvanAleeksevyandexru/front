import { TestBed } from '@angular/core/testing';
import { ScreenModalService } from './screen-modal.service';
import { ModalService } from '../modal.service';
import { ModalServiceStub } from '../modal.service.stub';


describe('ScreenModalService', () => {
  let service: ScreenModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScreenModalService, { provide: ModalService, useClass: ModalServiceStub }],
    });
    service = TestBed.inject(ScreenModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
