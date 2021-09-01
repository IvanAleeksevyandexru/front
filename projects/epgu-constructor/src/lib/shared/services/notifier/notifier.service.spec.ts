import { TestBed } from '@angular/core/testing';
import { NotifierDisclaimerService } from './notifier.service';

describe('NotifierDisclaimerService', () => {
  let notifierService: NotifierDisclaimerService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [NotifierDisclaimerService],
    });
    notifierService = TestBed.inject(NotifierDisclaimerService);
  });

  it('should be created', () => {
    expect(notifierService).toBeDefined();
  });

  describe('open()', () => {
    it('should call notifier() method', () => {
      const spy = jest.spyOn(notifierService, 'notifier');
      notifierService.open({});
      expect(spy).toHaveBeenCalled();
    });
  });
});
