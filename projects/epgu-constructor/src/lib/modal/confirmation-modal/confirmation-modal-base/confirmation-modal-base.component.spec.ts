import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalBaseComponent } from './confirmation-modal-base.component';
import { A11yModule } from '@angular/cdk/a11y';
import { EventBusService, UnsubscribeService, DeviceDetectorServiceStub, DeviceDetectorService } from '@epgu/epgu-constructor-ui-kit';
import { BaseModule } from '../../../shared/base.module';
import { ScreenButtonsModule } from '../../../shared/components/screen-buttons/screen-buttons.module';


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
