import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { RadioTaxComponent } from './radio-tax.component';


describe('RadioTaxComponent', () => {
  let component: RadioTaxComponent;
  let fixture: ComponentFixture<RadioTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioTaxComponent],
      providers: [EventBusService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
