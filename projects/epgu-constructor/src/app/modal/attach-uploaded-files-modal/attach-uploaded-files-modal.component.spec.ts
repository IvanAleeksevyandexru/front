import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceDetectorServiceStub } from '../../core/services/device-detector/device-detector.service.stub';
import { DeviceDetectorService } from '../../core/services/device-detector/device-detector.service';
import { AttachUploadedFilesModalComponent } from './attach-uploaded-files-modal.component';
import { BaseModule } from '../../shared/base.module';
import { ScreenService } from '../../screen/screen.service';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';
import { DatesToolsService } from '../../core/services/dates-tools/dates-tools.service';
import { ConfigService } from '../../core/services/config/config.service';
import { ConfigServiceStub } from '../../core/services/config/config.service.stub';

describe('AttachUploadedFilesModalComponent', () => {
  let component: AttachUploadedFilesModalComponent;
  let fixture: ComponentFixture<AttachUploadedFilesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AttachUploadedFilesModalComponent,
      ],
      imports:[
        BaseModule,
        ConfirmationModalModule,
      ],
      providers:[
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        EventBusService,
        UnsubscribeService,
        DatesToolsService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachUploadedFilesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {
    jest.spyOn(component, 'closeModal');
    component.detachView = () => null;
    expect(component.closeModal).toHaveBeenCalledTimes(0);
  });
});
