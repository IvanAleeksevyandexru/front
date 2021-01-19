import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockModule } from 'ng-mocks';

import { TimerComponent } from '../../component/component-screen/components/timer/timer.component';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import {
  ComponentActionDto,
  DTOActionAction,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ComponentScreenComponent } from './component-screen.component';
import { ComponentResolverComponent } from '../../component/component-resolver/component-resolver.component';
import { ComponentWrapperModule } from '../../component/component-screen/shared/component-wrapper.module';
import { ComponentScreenComponentTypes } from '../../component/component-screen/component-screen-components.types';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { CurrentAnswersService } from '../current-answers.service';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';

const componentActionDtoSample1: ComponentActionDto = {
  label: 'label1',
  value: 'value1',
  color: 'white',
  action: DTOActionAction.editEmail,
};

describe('ComponentScreenComponent', () => {
  let component: ComponentScreenComponent;
  let fixture: ComponentFixture<ComponentScreenComponent>;
  let screenService: ScreenServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MockModule(EpguLibModule), MockModule(ComponentWrapperModule)],
      declarations: [
        ComponentScreenComponent,
        MockComponents(ComponentResolverComponent, TimerComponent),
      ],
      providers: [
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        UnsubscribeService,
        CurrentAnswersService,
        EventBusService,
      ],
    })
      .overrideComponent(ComponentScreenComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    component.nextStepAction = componentActionDtoSample1;
    component.screenComponentName = ComponentScreenComponentTypes;
    fixture.detectChanges();

    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('actionButtons$', () => {
    it('should be return array with buttons', fakeAsync(() => {
      screenService.actions = [componentActionDtoSample1];
      fixture.detectChanges();
      tick(1);

      component.actionButtons$.subscribe((value) => {
        expect(value.length).toBe(1);
      });
    }));

    it('should be return empty array', fakeAsync(() => {
      screenService.actions = [];
      fixture.detectChanges();
      tick(1);

      component.actionButtons$.subscribe((value) => {
        expect(value.length).toBe(0);
      });
    }));
  });

  describe('screenActionButtons$', () => {
    it('should be return array with buttons', fakeAsync(() => {
      screenService.buttons = [componentActionDtoSample1];
      fixture.detectChanges();
      tick(1);

      component.screenActionButtons$.subscribe((value) => {
        expect(value.length).toBe(1);
      });
    }));

    it('should be return empty array', fakeAsync(() => {
      screenService.buttons = [];
      fixture.detectChanges();
      tick(1);

      component.screenActionButtons$.subscribe((value) => {
        expect(value.length).toBe(0);
      });
    }));
  });

  describe('calcIsShowActionBtn', () => {
    it('isShowActionBtn$ should be return true', fakeAsync(() => {
      screenService.componentType = ComponentScreenComponentTypes.divorceConsent;
      fixture.detectChanges();
      tick(1);

      component.isShowActionBtn$.subscribe((value) => {
        expect(value).toBeTruthy();
      });
    }));

    it('isShowActionBtn$ should be return false', fakeAsync(() => {
      screenService.componentType = ComponentScreenComponentTypes.childrenList;
      fixture.detectChanges();
      tick(1);

      component.isShowActionBtn$.subscribe((value) => {
        expect(value).toBeFalsy();
      });
    }));
  });

  describe('calcIsShowActionBtn', () => {
    it('should be return true', () => {
      const result = component.calcIsShowActionBtn(ComponentScreenComponentTypes.divorceConsent);
      expect(result).toBeTruthy();
    });

    it('should be return false', () => {
      const result = component.calcIsShowActionBtn(ComponentScreenComponentTypes.childrenList);
      expect(result).toBeFalsy();
    });
  });
});
