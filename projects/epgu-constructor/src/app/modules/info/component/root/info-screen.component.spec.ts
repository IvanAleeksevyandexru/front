import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub';
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
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
    type: SCREEN_TYPE.COMPONENT
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [ InfoScreenComponent ],
      providers: [
        NavigationService,
        UnsubscribeService,
        { provide: ConstructorService, useClass: ConstructorServiceStub }
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
