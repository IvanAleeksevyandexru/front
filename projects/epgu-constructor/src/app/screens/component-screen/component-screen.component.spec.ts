import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../constant/global';
import { DisplayInterface } from '../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../services/constructor/constructor.service';
import { ConstructorServiceStub } from '../../services/constructor/constructor.service.stub';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { ComponentStateService } from '../../services/component-state/component-state.service';
import { ComponentScreenComponent } from './component-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';


// TODO: Need to refactoring component
describe.skip('ScreenComponent', () => {
  let component: ComponentScreenComponent;
  let fixture: ComponentFixture<ComponentScreenComponent>;
  let navService: NavigationService;
  let constructorService: ConstructorService;
  let componentStateService: ComponentStateService;
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
      declarations: [ ComponentScreenComponent, ScreenContainerComponent ],
      providers: [
        NavigationService,
        { provide: ConstructorService, useClass: ConstructorServiceStub },
        ComponentStateService
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(ConstructorService);
    componentStateService = TestBed.inject(ComponentStateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
