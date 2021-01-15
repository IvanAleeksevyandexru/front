import { TestBed } from '@angular/core/testing';
import { CustomScreenService } from './custom-screen.service';

describe('CustomScreenService', () => {
  let service: CustomScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomScreenService]
    });
    service = TestBed.inject(CustomScreenService);
  });

  // @todo. Do we need to test private method?
  describe('getPrepareResponseData method', () => {
    it('without data', () => {
      //@ts-ignore
      const result = service.getPrepareResponseData();
      //@ts-ignore
      expect(result).toEqual({});
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
