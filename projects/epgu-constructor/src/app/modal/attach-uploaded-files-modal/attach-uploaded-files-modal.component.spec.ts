import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DeviceDetectorServiceStub } from '../../core/services/device-detector/device-detector.service.stub';
import { DeviceDetectorService } from '../../core/services/device-detector/device-detector.service';
import { AttachUploadedFilesModalComponent } from './attach-uploaded-files-modal.component';
import { BaseModule } from '../../shared/base.module';
import { ScreenService } from '../../screen/screen.service';
import { ScreenServiceStub } from '../../screen/screen.service.stub';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';

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
      ],
      providers:[
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: DeviceDetectorService, useClass: DeviceDetectorServiceStub },
        EventBusService,
        UnsubscribeService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachUploadedFilesModalComponent);
    component = fixture.componentInstance;
    // component.componentId = '';
    // component.data$ = of({ title: '', items: [] } as any);
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
