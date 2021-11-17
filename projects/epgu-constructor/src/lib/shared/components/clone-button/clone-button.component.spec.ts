import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusEventType, EventBusService } from '@epgu/epgu-constructor-ui-kit';
import { CloneButtonComponent } from './clone-button.component';

describe('CloneButtonComponent', () => {
  let component: CloneButtonComponent;
  let fixture: ComponentFixture<CloneButtonComponent>;
  let eventBusService: EventBusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CloneButtonComponent],
      providers: [EventBusService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloneButtonComponent);
    component = fixture.componentInstance;
    eventBusService = TestBed.inject(EventBusService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onClick()', () => {
    it('should call eventBusService.emit() with right context', () => {
      const spy = jest.spyOn(eventBusService, 'emit');
      component.onClick();
      expect(spy).toBeCalledWith(BusEventType.CloneButtonClickEvent);
    });
  });
});
