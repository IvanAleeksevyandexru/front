import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { CoreModule } from '../../../../../core/core.module';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { ComponentBase } from '../../../../../screen/screen.types';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../../shared/components/clone-button/clone-button.module';
import { ConstructorDropdownModule } from '../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { ValueLoaderService } from '../../../../../shared/services/value-loader/value-loader.service';
import { ComponentsListModule } from '../../../../components-list/components-list.module';
import { SelectChildrenItemWrapperComponent } from './select-children-item-wrapper.component';

describe('SelectChildrenScreenComponent', () => {
  let component: SelectChildrenItemWrapperComponent;
  let fixture: ComponentFixture<SelectChildrenItemWrapperComponent>;
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
        SelectChildrenItemWrapperComponent,
        NavigationComponentMock,
        MockComponent(ScreenPadComponent),
      ],
      imports: [
        CoreModule,
        BaseModule,
        BaseComponentsModule,
        CloneButtonModule,
        ReactiveFormsModule,
        ComponentsListModule,
        RouterTestingModule,
        ConstructorDropdownModule,
      ],
      providers: [
        CurrentAnswersService,
        CachedAnswersService,
        UnsubscribeService,
        ScreenService,
        HealthService,
        ValueLoaderService,
        EventBusService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChildrenItemWrapperComponent);
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
