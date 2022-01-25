import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DatesToolsService, ConfigService, LoggerService } from '@epgu/epgu-constructor-ui-kit';
import { CustomScreenService } from './custom-screen.service';
import { MockProvider } from 'ng-mocks';
import { HelperService } from '@epgu/ui/services/helper';

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
        MockProvider(HelperService),
      ],
    });
    service = TestBed.inject(CustomScreenService);
  });

  describe('getPrepareResponseData method', () => {
    it('without data', () => {
      // @ts-ignore
      const result = service.getPrepareResponseData();
      // @ts-ignore
      expect(result).toEqual({});
    });
  });
});
