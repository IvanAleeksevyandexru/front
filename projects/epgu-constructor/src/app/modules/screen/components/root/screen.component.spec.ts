import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenComponent } from './screen.component';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service'
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface'
import { COMPONENT_TYPE } from '../../../../../constant/global'
import { ConstructorService } from '../../../../services/constructor/constructor.service'
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub'
import { ScreenComponentService } from '../../service/screen-component/screen-component.service'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('ScreenComponent', () => {
  let component: ScreenComponent;
  let fixture: ComponentFixture<ScreenComponent>;
  let navService: NavigationService;
  let constructorService: ConstructorService;
  let screenComponentService: ScreenComponentService;
  const mockData: EgpuResponseDisplayInterface = {
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
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
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
