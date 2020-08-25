import { EpguLibModule } from 'epgu-lib'
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { COMPONENT_TYPE } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { InfoScreenComponent } from './info-screen.component';


describe('InfoScreenComponent', () => {
  let component: InfoScreenComponent;
  let fixture: ComponentFixture<InfoScreenComponent>;
  const mockData: DisplayInterface = {
    components: [
      {
        attrs: {},
        type: '',
        id: '',
        label: '',
        value: ''
      }
    ],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: COMPONENT_TYPE.COMPONENT
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ EpguLibModule.forChild() ],
      declarations: [ InfoScreenComponent ],
      providers: [
        NavigationService,
        UnsubscribeService,
        {provide: ConstructorService, useClass: ConstructorServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
