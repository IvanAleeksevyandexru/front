import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoScreenComponent } from './info-screen.component';
import { NavigationService } from '../../../../layout/service/navigation/navigation.service'
import { ConstructorService } from '../../../../services/constructor/constructor.service'
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub'
import { UnsubscribeService } from '../../../../services/unsubscribe/unsubscribe.service'
import { EgpuResponseDisplayInterface } from '../../../../../interfaces/epgu.service.interface'
import { COMPONENT_TYPE } from '../../../../../constant/global'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('InfoScreenComponent', () => {
  let component: InfoScreenComponent;
  let fixture: ComponentFixture<InfoScreenComponent>;
  let mockData: EgpuResponseDisplayInterface = {
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
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
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
