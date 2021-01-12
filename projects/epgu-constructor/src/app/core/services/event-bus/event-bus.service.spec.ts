import { TestBed } from '@angular/core/testing';
import { EventBusService } from './event-bus.service';


describe('EventBusService', () => {
  let service: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventBusService]
    });
    service = TestBed.inject(EventBusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
