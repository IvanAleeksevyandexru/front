import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockDirective, MockModule } from 'ng-mocks';
import { ComponentScreenComponentTypes } from '../../component/component-screen/component-screen-components.types';
// eslint-disable-next-line max-len
import { AddPassportContainerComponent } from '../../component/component-screen/components/add-passport/container/add-passport-component-container.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserAddressComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-address-screen/components/confirm-personal-user-address/confirm-personal-user-address.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserDataComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-data-screen/component/confirm-personal-user-data/confirm-personal-user-data.component';
// eslint-disable-next-line max-len
import { ConfirmPersonalUserPhoneEmailComponent } from '../../component/component-screen/components/confirm-personal-user/screens/confirm-personal-user-phone-email/confirm-personal-user-phone-email.component';
// eslint-disable-next-line max-len
import { RegistrationAddrComponent } from '../../component/component-screen/components/confirm-personal-user/screens/registration-addr/components/registration-addr/registration-addr.component';
// eslint-disable-next-line max-len
import { SelectChildrenScreenComponent } from '../../component/component-screen/components/select-children/select-children-screen.component';
import { TimerComponent } from '../../component/component-screen/components/timer/timer.component';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import {
  ComponentActionDto,
  ComponentDto,
  DTOActionAction
} from '../../form-player/services/form-player-api/form-player-api.types';
import { AnswerButtonComponent } from '../../shared/components/answer-button/answer-button.component';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { FieldListComponent } from '../../shared/components/field-list/field-list.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ComponentWrapperComponent } from './component-wrapper.component';
import { ComponentResolverComponent } from '../../component/component-resolver/component-resolver.component';

const componentActionDtoSample1: ComponentActionDto = {
  label: 'label1',
  value: 'value1',
  color: 'white',
  action: DTOActionAction.editEmail,
};

const componentActionDtoSample2: ComponentActionDto = {
  label: 'label2',
  value: 'value2',
  color: 'transparent',
  action: DTOActionAction.getNextStep,
};

const componentDtoSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

describe('ComponentScreenComponent', () => {
  let component: ComponentWrapperComponent;
  let fixture: ComponentFixture<ComponentWrapperComponent>;
  let screenService: ScreenServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MockModule(EpguLibModule)],
      declarations: [
        ComponentWrapperComponent,
        MockComponents(
          ScreenContainerComponent,
          PageNameComponent,
          ScreenPadComponent,
          FieldListComponent,
          TimerComponent,
          AnswerButtonComponent,
          ComponentResolverComponent,
        ),
        MockDirective(ActionDirective),
      ],
      providers: [
        CurrentAnswersService,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        EventBusService,
      ],
    }).overrideComponent(ComponentWrapperComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
  });

  describe('isShowActionBtn property', () => {
    it('should be FALSE by default', () => {
      expect(component.isShowActionBtn).toBeFalsy();
    });
  });

  it('should call calcIsShowActionBtn on componentType change', () => {
    const setScreenComponentSpy = spyOn(component, 'calcIsShowActionBtn');

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserEmail;
    expect(setScreenComponentSpy).toBeCalledTimes(1);
    expect(setScreenComponentSpy).toBeCalledWith(
      ComponentScreenComponentTypes.confirmPersonalUserEmail,
    );
    setScreenComponentSpy.calls.reset();

    screenService.componentType = ComponentScreenComponentTypes.confirmPersonalUserPhone;
    expect(setScreenComponentSpy).toBeCalledTimes(1);
    expect(setScreenComponentSpy).toBeCalledWith(
      ComponentScreenComponentTypes.confirmPersonalUserPhone,
    );
  });

  describe('calcIsShowActionBtn() method', () => {
    it('should set isShowActionBtn property', () => {
      component.calcIsShowActionBtn(ComponentScreenComponentTypes.childrenListAbove14);

      expect(component.isShowActionBtn).toBeFalsy();

      component.calcIsShowActionBtn(ComponentScreenComponentTypes.divorceConsent);

      expect(component.isShowActionBtn).toBeTruthy();
    });
  });

  describe('epgu-constructor-screen-container', () => {
    const selector = 'epgu-constructor-screen-container';

    it('should be rendered', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('showNav property should be TRUE if screenService.showNav is TRUE, otherwise should be FALSE', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = false;
      fixture.detectChanges();

      expect(debugEl.componentInstance.showNav).toBeFalsy();

      screenService.showNav = true;
      fixture.detectChanges();

      expect(debugEl.componentInstance.showNav).toBeTruthy();
    });
  });

  it('should render epgu-constructor-page-name if header is not empty', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-page-name';

    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.header = 'foo';
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.textContent.trim()).toBe('foo');
  });

  it('should render epgu-constructor-screen-pad', () => {
    const selector = 'epgu-constructor-screen-container';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render action buttons if isShowActionBtn is TRUE', () => {
    const selector = 'epgu-constructor-screen-container lib-button[epgu-constructor-action]';

    let debugElements = fixture.debugElement.queryAll(By.css(selector));

    expect(debugElements.length).toBe(0);

    screenService.componentType = ComponentScreenComponentTypes.divorceConsent;
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));
    expect(debugElements.length).toBe(0);

    screenService.actions = [componentActionDtoSample1, componentActionDtoSample2];
    fixture.detectChanges();

    debugElements = fixture.debugElement.queryAll(By.css(selector));

    expect(debugElements.length).toBe(2);

    expect(debugElements[0].injector.get(ActionDirective).action).toBe(componentActionDtoSample1);
    expect(debugElements[0].componentInstance.color).toBe(componentActionDtoSample1.color);
    expect(debugElements[0].nativeElement.textContent.trim()).toBe(componentActionDtoSample1.label);

    expect(debugElements[1].injector.get(ActionDirective).action).toBe(componentActionDtoSample2);
    expect(debugElements[1].componentInstance.color).toBe(componentActionDtoSample2.color);
    expect(debugElements[1].nativeElement.textContent.trim()).toBe(componentActionDtoSample2.label);
  });
});
