import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { EpguLibModule, HealthService } from 'epgu-lib';
import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { SharedModule } from '../../shared.module';
import { PassportComponent } from './passport.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PassportComponent', () => {
  let component: PassportComponent;
  let fixture: ComponentFixture<PassportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule, FormsModule, SharedModule, RouterTestingModule ],
      declarations: [],
      providers: [UnsubscribeService, HealthService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassportComponent);
    component = fixture.componentInstance;
    component.attrs = {
      fields: []
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
