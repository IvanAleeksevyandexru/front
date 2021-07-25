import { TestBed } from '@angular/core/testing';

import { CertificateEaisdoService } from './certificate-eaisdo.service';

describe('CertificateEaisdoService', () => {
  let service: CertificateEaisdoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CertificateEaisdoService,
      ]
    });
    service = TestBed.inject(CertificateEaisdoService);

  });

  it('exists', () => {
    service.showButtons = true;
    expect(service.showButtons).toBeTruthy();

    service.showButtons = false;
    expect(service.showButtons).toBeFalsy();
  });
});
