import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { ComponentInterface } from '../../../../../../../interfaces/epgu.service.interface';
import { ConstructorService } from '../../../../../../services/constructor/constructor.service';
import { ConstructorServiceStub } from '../../../../../../services/constructor/constructor.service.stub';
import { NavigationComponent } from '../../../../../../shared-module/components/navigation/navigation.component';
import { PageNameComponent } from '../../../../../../shared-module/components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../../../../../shared-module/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../../../../../shared-module/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../../../../../shared-module/service/navigation/navigation.service';
import { ScreenComponentService } from '../../../../service/screen-component/screen-component.service';
import { AddChildrenScreenComponent } from './add-children-screen.component';

describe('AddChildrenScreenComponent', () => {
  let component: AddChildrenScreenComponent;
  let fixture: ComponentFixture<AddChildrenScreenComponent>;
  let navService: NavigationService;
  let constructorService: ConstructorService;
  let screenComponentService: ScreenComponentService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  const mockData: ComponentInterface = {
    attrs: [],
    id: '',
    label: '',
    type: '',
    value: '{}', // json-string friendly
    visited: false,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddChildrenScreenComponent,
        PageNameComponent,
        ScreenPadComponent,
        ScreenContainerComponent,
        NavigationComponentMock,
        ButtonComponent
      ],
      providers: [
        NavigationService,
        ScreenComponentService,
        // { provide: ScreenComponentService, useClass: ScreenComponentServiceStub },
        { provide: ConstructorService, useClass: ConstructorServiceStub },
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(ConstructorService);
    screenComponentService = TestBed.inject(ScreenComponentService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildrenScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.addNewChild();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
