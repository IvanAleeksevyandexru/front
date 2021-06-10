import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfigService } from '../../core/services/config/config.service';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { LoggerService } from '../../core/services/logger/logger.service';
import { CustomScreenService } from './custom-screen.service';

describe('CustomScreenService', () => {
  let service: CustomScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CustomScreenService,
        DatesToolsService,
        ConfigService,
        LoggerService,
      ]
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
