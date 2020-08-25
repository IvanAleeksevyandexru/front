import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib'

import { ConfirmPersonalUserDataScreenComponent } from './confirm-personal-user-data-screen.component';
import { ConfirmUserDataInterface } from '../../../../../../../interfaces/confirm-user-data.interface'



describe('ConfirmPersonalUserDataScreenComponent', () => {
  let component: ConfirmPersonalUserDataScreenComponent;
  let fixture: ComponentFixture<ConfirmPersonalUserDataScreenComponent>;
  const mockData: ConfirmUserDataInterface = {
    attrs: {
      fields: [],
      actions: []
    },
    id: '',
    label: '',
    type: '',
    value: '',
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ ConfirmPersonalUserDataScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmPersonalUserDataScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
