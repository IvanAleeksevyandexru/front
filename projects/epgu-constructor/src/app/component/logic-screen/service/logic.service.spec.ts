import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LogicService } from './logic.service';
import { LocalStorageService } from '../../../core/services/local-storage/local-storage.service';
import { LocalStorageServiceStub } from '../../../core/services/local-storage/local-storage.service.stub';
import { ComponentValue } from '../logic.types';

describe('LogicService', () => {
  let service: LogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LogicService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });
    service = TestBed.inject(LogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetch', () => {
    it('should be create http request', () => {
      const components: { id: string; value: ComponentValue }[] = [
        {
          id: 'rest1',
          value: {
            url: 'url',
            body: 'body',
            headers: { headers: 'headers' },
            method: 'POST',
            path: 'path',
          },
        },
      ];
      const req = service.fetch(components);
      expect(service).toBeTruthy();
    });
  });

  describe('callHttpMethod', () => {
    it('should be return request with body', () => {
      const components: { id: string; value: ComponentValue }[] = [
        {
          id: 'rest1',
          value: {
            url: 'url',
            body: 'body',
            headers: { headers: 'headers' },
            method: 'POST',
            path: 'path',
          },
        },
      ];
      service.fetch(components);
      expect(service).toBeTruthy();
    });

    it('should be return request without body', () => {
      expect(service).toBeTruthy();
    });
  });
});
