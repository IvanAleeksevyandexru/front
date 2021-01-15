import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HealthService } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';

import { CoreModule } from '../../../../../core/core.module';
import { EventBusService } from '../../../../../core/services/event-bus/event-bus.service';
import { UnsubscribeService } from '../../../../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../../../../../screen/current-answers.service';
import { ScreenService } from '../../../../../screen/screen.service';
import { BaseModule } from '../../../../../shared/base.module';
import { BaseComponentsModule } from '../../../../../shared/components/base-components/base-components.module';
import { CloneButtonModule } from '../../../../../shared/components/clone-button/clone-button.module';
import { ConstructorDropdownModule } from '../../../../../shared/components/constructor-dropdown/constructor-dropdown.module';
import { NavigationComponent } from '../../../../../shared/components/navigation/navigation.component';
import { ScreenPadComponent } from '../../../../../shared/components/screen-pad/screen-pad.component';
import { CachedAnswersService } from '../../../../../shared/services/cached-answers/cached-answers.service';
import { ValueLoaderService } from '../../../../../shared/services/value-loader/value-loader.service';
import { ComponentsListModule } from '../../../../components-list/components-list.module';
import { SelectChildrenScreenContainerComponent } from './select-children-screen-container.component';

describe('SelectChildrenScreenContainerComponent', () => {
  let component: SelectChildrenScreenContainerComponent;
  let fixture: ComponentFixture<SelectChildrenScreenContainerComponent>;
  let NavigationComponentMock = MockComponent(NavigationComponent);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectChildrenScreenContainerComponent,
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
    fixture = TestBed.createComponent(SelectChildrenScreenContainerComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
