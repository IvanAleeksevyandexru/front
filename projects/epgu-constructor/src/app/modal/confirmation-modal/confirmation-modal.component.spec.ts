import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { EventBusService } from '../../form-player/services/event-bus/event-bus.service';
import { ConfirmationModalComponent } from './confirmation-modal.component';


xdescribe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule ],
      declarations: [ConfirmationModalComponent],
      providers: [UnsubscribeService, EventBusService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
