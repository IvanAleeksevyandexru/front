import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

import { CustomScreenComponent } from './custom-screen.component';
import { RestService } from '../../../../services/rest/rest.service'
import { RestServiceStub } from '../../../../services/rest/rest.service.stub'
import { NavigationService } from '../../../../layout/service/navigation/navigation.service'
import { ConstructorService } from '../../../../services/constructor/constructor.service'
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub'
import { EgpuResponseCustomComponentDisplayInterface } from '../../../../../interfaces/custom-component.interface'
import { COMPONENT_TYPE } from '../../../../../constant/global'


describe('CustomScreenComponent', () => {
  let component: CustomScreenComponent;
  let fixture: ComponentFixture<CustomScreenComponent>;
  let restService: RestService;
  let navService: NavigationService;
  let constructorService: ConstructorService;
  let mockData: EgpuResponseCustomComponentDisplayInterface = {
    components: [],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: COMPONENT_TYPE.COMPONENT
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ CustomScreenComponent ],
      providers: [
        NavigationService,
        {provide: RestService, useClass: RestServiceStub},
        {provide: ConstructorService, useClass: ConstructorServiceStub},
      ]
    })
    .compileComponents();
    restService = TestBed.inject(RestService);
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(ConstructorService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
