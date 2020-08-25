import { EpguLibModule } from 'epgu-lib'
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { COMPONENT_TYPE } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub';
import { ScreenComponentService } from '../../service/screen-component/screen-component.service';
import { ScreenComponent } from './screen.component';



describe('ScreenComponent', () => {
  let component: ScreenComponent;
  let fixture: ComponentFixture<ScreenComponent>;
  let navService: NavigationService;
  let constructorService: ConstructorService;
  let screenComponentService: ScreenComponentService;
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
    type: COMPONENT_TYPE.COMPONENT
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ ScreenComponent ],
      providers: [
        NavigationService,
        { provide: ConstructorService, useClass: ConstructorServiceStub },
        ScreenComponentService
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(ConstructorService);
    screenComponentService = TestBed.inject(ScreenComponentService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
