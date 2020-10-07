import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { UnsubscribeService } from '../../../../../../services/unsubscribe/unsubscribe.service';
import { PageNameComponent } from '../../../../../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../../../../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../../../../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../../../../../shared/components/screen-pad/screen-pad.component';
import { CurrentAnswersService } from '../../../../../current-answers.service';
import { SelectChildrenScreenComponent } from './select-children-screen.component';

describe('SelectChildrenScreenComponent', () => {
  let component: SelectChildrenScreenComponent;
  let fixture: ComponentFixture<SelectChildrenScreenComponent>;
  let currentAnswersService: CurrentAnswersService;
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
        SelectChildrenScreenComponent,
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
        CurrentAnswersService,
        UnsubscribeService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    currentAnswersService = fixture.debugElement.injector.get(CurrentAnswersService);
    component.addMoreChild();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
