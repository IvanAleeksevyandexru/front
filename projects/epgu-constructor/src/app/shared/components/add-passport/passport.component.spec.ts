import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule, HealthService } from 'epgu-lib';

import { UnsubscribeService } from '../../../core/services/unsubscribe/unsubscribe.service';
import { SharedModule } from '../../shared.module';
import { PassportComponent } from './passport.component';
import { ConstructorMaskedInputModule } from '../epgu-lib/constructor-masked-input/constructor-masked-input.module';

describe('PassportComponent', () => {
  let component: PassportComponent;
  let fixture: ComponentFixture<PassportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule, FormsModule, SharedModule, RouterTestingModule, ConstructorMaskedInputModule ],
      declarations: [PassportComponent],
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
