import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CtaModalComponent } from './cta-modal.component';
import { A11yModule } from '@angular/cdk/a11y';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { BaseUiModule } from '../../../base/base-ui.module';
import { EpguLibModule } from '@epgu/epgu-lib';


describe('ConfirmationModalBaseComponent', () => {
  let component: CtaModalComponent;
  let fixture: ComponentFixture<CtaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CtaModalComponent],
      imports: [BaseUiModule, A11yModule, EpguLibModule.forRoot()],
      providers: [
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        EventBusService,
        UnsubscribeService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CtaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
