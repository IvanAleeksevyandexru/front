import { AddChildrenScreenComponent } from './add-children-screen.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentStateService } from '../../../../../../components/component-state.service';
import { NavigationComponent } from '../../../../../../shared/components/navigation/navigation.component';
import { MockComponent } from 'ng-mocks';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PageNameComponent } from '../../../../../../shared/components/base/page-name/page-name.component';
import { ScreenPadComponent } from '../../../../../../shared/components/screen-pad/screen-pad.component';
import { ScreenContainerComponent } from '../../../../../../shared/components/screen-container/screen-container.component';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';

describe('AddChildrenScreenComponent', () => {
  let component: AddChildrenScreenComponent;
  let fixture: ComponentFixture<AddChildrenScreenComponent>;
  let componentStateService: ComponentStateService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  const mockData = {
    attrs: [],
    id: '',
    label: '',
    type: '',
    value: '{}', // json-string friendly
    visited: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddChildrenScreenComponent,
        NavigationComponentMock,
        PageNameComponent,
        ScreenPadComponent,
        ScreenContainerComponent,
        NavigationComponentMock,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        ComponentStateService,
        UnsubscribeService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChildrenScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    componentStateService = fixture.debugElement.injector.get(ComponentStateService);
    component.addMoreChild();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
