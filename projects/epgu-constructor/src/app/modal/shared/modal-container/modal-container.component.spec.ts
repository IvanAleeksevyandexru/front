import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalService } from '../../modal.service';
import { ModalContainerComponent } from './modal-container.component';
import { DeviceDetectorService } from '../../../core/services/device-detector/device-detector.service';
import { HttpClientModule } from '@angular/common/http';


describe('ModalContainerComponent', () => {
  let component: ModalContainerComponent;
  let fixture: ComponentFixture<ModalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContainerComponent ],
      providers: [ DeviceDetectorService, ModalService ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
