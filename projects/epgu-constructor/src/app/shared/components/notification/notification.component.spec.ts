import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisclaimerElkComponent } from 'epgu-lib';

import { NotificationComponent } from './notification.component';
import { NotificationService } from '../../services/notification/notification.service';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationComponent, DisclaimerElkComponent ],
      providers: [NotificationService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
