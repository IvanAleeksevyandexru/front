import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib'
// eslint-disable-next-line max-len
import { TemporaryRegistrationAddrComponentInterface } from '../../../../../../../interfaces/temporary-registration-addr.interface';
import { TemporaryRegistrationAddrScreenComponent } from './temporary-registration-addr-screen.component';


describe('TemporaryRegistrationAddrScreenComponent', () => {
  let component: TemporaryRegistrationAddrScreenComponent;
  let fixture: ComponentFixture<TemporaryRegistrationAddrScreenComponent>;
  const mockData: TemporaryRegistrationAddrComponentInterface = {
    attrs: {
      actions: [],
      fields: [],
      hints: []
    },
    id: '',
    label: '',
    type: '',
    value: ''
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ TemporaryRegistrationAddrScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemporaryRegistrationAddrScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
