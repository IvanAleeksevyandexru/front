import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DeviceDetectorServiceStub } from '../../../core/services/device-detector/device-detector.service.stub';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { DropdownListModalComponent } from './dropdown-list-modal.component';
import { DropdownListComponent } from './dropdown-list/dropdown-list.component';
import { FilterPipe } from '../pipes/filter.pipe';
import { BaseModule } from '../../../shared/base.module';
import { ConfirmationModalModule } from '../../confirmation-modal/confirmation-modal.module';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';
import { EventBusService } from '../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';

describe('DropdownListModalComponent', () => {
  let component: DropdownListModalComponent;
  let fixture: ComponentFixture<DropdownListModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DropdownListModalComponent,
        DropdownListComponent,
        FilterPipe,
      ],
      imports:[
        BaseModule,
        ConfirmationModalModule,
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
    fixture = TestBed.createComponent(DropdownListModalComponent);
    component = fixture.componentInstance;
    component.componentId = '';
    component.data$ = of({ title: '', items: [] } as any);
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
