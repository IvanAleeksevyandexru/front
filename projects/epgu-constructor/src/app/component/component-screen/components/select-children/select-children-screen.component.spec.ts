import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { UnsubscribeService } from '../../../../core/services/unsubscribe/unsubscribe.service';
import { NavigationComponent } from '../../../../shared/components/navigation/navigation.component';
import { CurrentAnswersService } from '../../../../screen/current-answers.service';
import { ScreenService } from '../../../../screen/screen.service';
import { ComponentBase } from '../../../../screen/screen.types';
import { SelectChildrenScreenComponent } from './select-children-screen.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ComponentsListModule } from '../../../components-list/components-list.module';
import { CoreModule } from '../../../../core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { ConstructorDropdownModule } from '../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { of } from 'rxjs';

describe('SelectChildrenScreenComponent', () => {
  let component: SelectChildrenScreenComponent;
  let fixture: ComponentFixture<SelectChildrenScreenComponent>;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  const mockData: ComponentBase = {
    attrs: {},
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
      ],
      imports: [
        CoreModule,
        SharedModule,
        ReactiveFormsModule,
        ComponentsListModule,
        RouterTestingModule,
        ConstructorDropdownModule,
      ],
      providers: [
        CurrentAnswersService,
        UnsubscribeService,
        ScreenService,
        HealthService
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenScreenComponent);
    fixture.debugElement.injector.get(CurrentAnswersService);
    fixture.debugElement.injector.get(UnsubscribeService);
    fixture.debugElement.injector.get(ScreenService);
    component = fixture.componentInstance;
    component.data$ = of(mockData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
