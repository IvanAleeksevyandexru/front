import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import { UniqueScreenComponent } from './unique-screen.component';

describe('UniqueScreenComponent', () => {
  let component: UniqueScreenComponent;
  let fixture: ComponentFixture<UniqueScreenComponent>;
  let navService: NavigationService;
  const mockData: DisplayInterface = {
    components: [{
      attrs: {},
      id: '',
      label: '',
      type: '',
      value: ''
    }],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: SCREEN_TYPE.COMPONENT
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ UniqueScreenComponent ],
      providers: [NavigationService]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
