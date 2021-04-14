import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { CustomScreenService } from './custom-screen.service';

describe('CustomScreenService', () => {
  let service: CustomScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomScreenService, DatesToolsService]
    });
    service = TestBed.inject(CustomScreenService);
  });

  describe('getPrepareResponseData method', () => {
    it('without data', () => {
      //@ts-ignore
      const result = service.getPrepareResponseData();
      //@ts-ignore
      expect(result).toEqual({});
    });
  });
});
