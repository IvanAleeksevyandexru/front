import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import * as moment_ from 'moment';
import { MockComponent, MockModule } from 'ng-mocks';
import { ComponentsListComponent } from '../../component/components-list/components-list.component';
import {
  CustomComponentOutputData,
  CustomComponentValidationConditions,
} from '../../component/components-list/components-list.types';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { NavigationPayload } from '../../form-player/form-player.types';
import { EventBusService } from '../../form-player/services/event-bus/event-bus.service';
import { ComponentDto } from '../../form-player/services/form-player-api/form-player-api.types';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenTypes } from '../screen.types';
import { CustomScreenComponent } from './custom-screen.component';
import { ChangeDetectionStrategy } from '@angular/core';

const moment = moment_;

describe('CustomScreenComponent', () => {
  let component: CustomScreenComponent;
  let fixture: ComponentFixture<CustomScreenComponent>;

  let screenService: ScreenServiceStub;
  let navigationService: NavigationServiceStub;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockModule(EpguLibModule)],
      declarations: [
        CustomScreenComponent,
        MockComponent(PageNameComponent),
        MockComponent(ComponentsListComponent),
        MockComponent(ScreenPadComponent),
        MockComponent(ScreenContainerComponent),
      ],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        EventBusService,
      ],
    }).overrideComponent(CustomScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
  });

  it('check snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('dataToSend property', () => {
    it('should be undefined by default', () => {
      expect(component.dataToSend).toBeUndefined();
    });
  });

  describe('isValid property', () => {
    it('should be undefined by default', () => {
      expect(component.isValid).toBeUndefined();
    });
  });

  describe('nextStep() method', () => {
    it('should call navigationService.next()', () => {
      const nextStepSpy = spyOn(navigationService, 'next');

      component.nextStep();

      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: undefined,
      });
      nextStepSpy.calls.reset();

      const dataToSend: NavigationPayload = {
        foo: {
          visited: true,
          value: 'bar',
        },
      };

      component.dataToSend = dataToSend;

      component.nextStep();
      expect(nextStepSpy).toBeCalledTimes(1);
      expect(nextStepSpy).toBeCalledWith({
        payload: dataToSend,
      });
    });
  });

  describe('getFormattedData() method', () => {
    it('without data', () => {
      const date = new Date();
      const changes: CustomComponentOutputData = {
        any: {
          value: date.toISOString(),
          valid: true,
        },
      };
      const expectedResult = {
        any: { visited: true, disabled: undefined, value: moment(date).toISOString() },
      };

      const result = component.getFormattedData(changes);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('changeComponentList() method', () => {
    // @todo. fix type
    const expectedDataSend: CustomComponentOutputData = ({
      any: {
        value: 'any',
        visited: true,
        disabled: undefined,
      },
    } as unknown) as CustomComponentOutputData;

    it('condition === atLeastOne', () => {
      // @todo. fix type
      const changes: CustomComponentOutputData = ({
        any: {
          condition: CustomComponentValidationConditions.atLeastOne,
          isValid: true,
          value: 'any',
        },
      } as unknown) as CustomComponentOutputData;

      component.changeComponentsList(changes);

      expect(component.isValid).toBeTruthy();
      expect(component.dataToSend).toEqual(expectedDataSend);
    });

    it('condition !== atLeastOne', () => {
      // @todo. fix type
      const changes: CustomComponentOutputData = ({
        any: {
          condition: 'any',
          isValid: false,
          value: 'any',
        },
      } as unknown) as CustomComponentOutputData;

      component.changeComponentsList(changes);

      expect(component.isValid).toBeFalsy();
      expect(component.dataToSend).toEqual(expectedDataSend);
    });
  });

  // @todo. Do we need to test private method?
  describe('getPrepareResponseData method', () => {
    it('without data', () => {
      //@ts-ignore
      const result = component.getPrepareResponseData();
      //@ts-ignore
      expect(result).toEqual({});
    });
  });

  describe('navigation cases', () => {
    it('onClick lib button should call nextScreen()', () => {
      spyOn(component, 'nextStep').and.callThrough();
      screenService.submitLabel = 'next';
      fixture.detectChanges();
      const libButton = fixture.debugElement.nativeElement.querySelector('.btn__submit');
      libButton.click();
      expect(component.nextStep).toHaveBeenCalled();
    });

    it('nextScreen() should call next of navigationService', () => {
      component.dataToSend = { any: { visited: true, value: '' }};
      spyOn(navigationService, 'next').and.callThrough();
      component.nextStep();
      expect(navigationService.next).toHaveBeenCalled();
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

  it('should render epgu-constructor-page-name', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-page-name';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-screen-pad', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-screen-pad';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-components-list', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-components-list';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.components).toBeNull();
    expect(debugEl.componentInstance.errors).toBeNull();

    const components: ComponentDto[] = [
      {
        attrs: {},
        id: 'id1',
        type: 'type1',
      },
    ];
    screenService.display = {
      components,
      header: 'header1',
      id: 'id1',
      name: 'name1',
      submitLabel: 'label1',
      type: ScreenTypes.CUSTOM,
      terminal: true,
    };

    const componentErrors = (screenService.componentErrors = {
      foo: 'bar',
    });

    fixture.detectChanges();

    expect(debugEl.componentInstance.components).toBe(components);
    expect(debugEl.componentInstance.errors).toBe(componentErrors);
  });

  it('should call changeComponentsList() on epgu-constructor-components-list changes() event', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-components-list';

    const debugEl = fixture.debugElement.query(By.css(selector));

    const date = new Date();
    const changesData: CustomComponentOutputData = {
      any: {
        value: date.toISOString(),
        valid: true,
      },
    };

    const changeComponentsListSpy = spyOn(component, 'changeComponentsList');

    debugEl.triggerEventHandler('changes', changesData);

    expect(changeComponentsListSpy).toBeCalledTimes(1);
    expect(changeComponentsListSpy).toBeCalledWith(changesData);
  });

  describe('Submit button', () => {
    const selector = 'epgu-constructor-screen-container lib-button';

    it('should be rendered if screenService.submitLabel is TRUE', () => {
      let debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeNull();

      screenService.submitLabel = 'any';
      fixture.detectChanges();

      debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl).toBeTruthy();
    });

    it('showLoader property should be equal screenService.isLoading', () => {
      screenService.submitLabel = 'any';
      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.showLoader).toBeFalsy();

      screenService.isLoadingSubject$.next(true);
      fixture.detectChanges();

      expect(debugEl.componentInstance.showLoader).toBeTruthy();
    });

    it('disabled property should be TRUE if screenService.isLoading is TRUE or isValid is FALSE', () => {
      screenService.submitLabel = 'any';

      screenService.isLoadingSubject$.next(true);
      component.isValid = false;

      fixture.detectChanges();

      const debugEl = fixture.debugElement.query(By.css(selector));

      expect(debugEl.componentInstance.disabled).toBeTruthy();

      screenService.isLoadingSubject$.next(false);
      fixture.detectChanges();

      expect(debugEl.componentInstance.disabled).toBeTruthy();

      component.isValid = true;
      fixture.detectChanges();

      expect(debugEl.componentInstance.disabled).toBeFalsy();
    });
  });

  it('should call nextStep() on Submit button click() event', () => {
    const selector = 'epgu-constructor-screen-container lib-button';

    screenService.submitLabel = 'any';
    fixture.detectChanges();

    const debugEl = fixture.debugElement.query(By.css(selector));

    const nextStepSpy = spyOn(component, 'nextStep');

    debugEl.triggerEventHandler('click', 'any');

    expect(nextStepSpy).toBeCalledTimes(1);
    expect(nextStepSpy).toBeCalledWith(); // ignore arguments from click event
  });
});
