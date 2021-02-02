import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfigService } from '../../../../../../core/services/config/config.service';
import { EventBusService } from '../../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../../core/services/unsubscribe/unsubscribe.service';
import { PhotoRequirementsModalComponent } from './photo-requirements-modal.component';

xdescribe('PhotoRequirementsModalComponent', () => {
  let component: PhotoRequirementsModalComponent;
  let fixture: ComponentFixture<PhotoRequirementsModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PhotoRequirementsModalComponent],
        providers: [ConfigService, UnsubscribeService, EventBusService],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoRequirementsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
