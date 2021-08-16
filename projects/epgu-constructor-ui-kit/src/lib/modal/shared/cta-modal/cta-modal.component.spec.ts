import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CtaModalComponent } from './cta-modal.component';
import { A11yModule } from '@angular/cdk/a11y';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { BaseUiModule } from '../../../base/base-ui.module';
import { EpguLibModule } from '@epgu/epgu-lib';
import { By } from '@angular/platform-browser';


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

  it('should init scroll on top', () => {
    fixture.detectChanges();

    const selector = '.conf-modal__body';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl.nativeElement.scrollTop === 0).toBeTruthy();
  });

  it('should render perfect scrollbar if is not mobile and is not short modal', () => {
    component.isMobile = false;
    component.isShortModal = false;
    fixture.detectChanges();

    const selector = 'perfect-scrollbar';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();
  });

  it('should not render perfect scrollbar if is mobile', () => {
    fixture = TestBed.createComponent(CtaModalComponent);
    component = fixture.componentInstance;
    component.isMobile = true;
    component.isShortModal = false;
    fixture.detectChanges();

    const selector = 'perfect-scrollbar';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeFalsy();
  });

  it('should not render perfect scrollbar if is shortModal', () => {
    fixture = TestBed.createComponent(CtaModalComponent);
    component = fixture.componentInstance;
    component.isMobile = false;
    component.isShortModal = true;
    fixture.detectChanges();

    const selector = 'perfect-scrollbar';
    const debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeFalsy();
  });
});
