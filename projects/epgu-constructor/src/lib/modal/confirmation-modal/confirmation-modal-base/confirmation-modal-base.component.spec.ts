import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalBaseComponent } from './confirmation-modal-base.component';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { BaseModule } from '../../../shared/base.module';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { A11yModule } from '@angular/cdk/a11y';
import { ScreenButtonsModule } from '../../../shared/components/screen-buttons/screen-buttons.module';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';

describe('ConfirmationModalBaseComponent', () => {
  let component: ConfirmationModalBaseComponent;
  let fixture: ComponentFixture<ConfirmationModalBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationModalBaseComponent],
      imports: [BaseModule, A11yModule, ScreenButtonsModule],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        EventBusService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationModalBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
