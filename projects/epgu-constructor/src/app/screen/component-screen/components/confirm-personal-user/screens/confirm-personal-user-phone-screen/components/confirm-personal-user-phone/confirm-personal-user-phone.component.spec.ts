import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { ComponentStateService } from '../../../../../../../../services/component-state/component-state.service';
import { LabelComponent } from '../../../../../../../../shared/components/base/label/label.component';
import { ConfirmPersonalUserPhoneComponent } from './confirm-personal-user-phone.component';

describe('ConfirmPersonalUserPhoneComponent', () => {
  let component: ConfirmPersonalUserPhoneComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserPhoneComponent>;
  const mockData = '';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, EpguLibModule.forChild() ],
      declarations: [ ConfirmPersonalUserPhoneComponent, LabelComponent ],
      providers: [ ComponentStateService, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserPhoneComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
