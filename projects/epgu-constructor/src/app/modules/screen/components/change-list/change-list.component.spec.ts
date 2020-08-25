import { EpguLibModule } from 'epgu-lib'
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';
import { ChangeListComponent, ChangeListComponentInterface } from './change-list.component';



describe('ChangeListComponent', () => {
  let component: ChangeListComponent;
  let fixture: ComponentFixture<ChangeListComponent>;
  let screenComponentService: ScreenComponentService;
  const mockData: ChangeListComponentInterface = {
    attrs: {
      fields: [{
        fieldName: 'name',
        label: 'Name',
        type: 'input'
      }]
    },
    id: '',
    label: '',
    type: '',
    value: '',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ ChangeListComponent ],
      providers: [ScreenComponentService]
    })
    .compileComponents();
    screenComponentService = TestBed.inject(ScreenComponentService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeListComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
