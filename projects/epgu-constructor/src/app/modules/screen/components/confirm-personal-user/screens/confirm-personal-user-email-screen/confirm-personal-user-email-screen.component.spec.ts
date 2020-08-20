import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmPersonalUserEmailScreenComponent } from './confirm-personal-user-email-screen.component';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service'
import { EgpuResponseComponentInterface } from '../../../../../../../interfaces/epgu.service.interface'

describe('ConfirmPersonalUserEmailComponent', () => {
  let component: ConfirmPersonalUserEmailScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserEmailScreenComponent>;
  const mockData: EgpuResponseComponentInterface = {
    attrs: {},
    id: '',
    label: '',
    value: '',
    type: ''
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmPersonalUserEmailScreenComponent ],
      providers: [ScreenComponentService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserEmailScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
