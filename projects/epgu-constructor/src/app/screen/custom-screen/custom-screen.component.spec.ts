import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import * as moment_ from 'moment';
import { MockComponent, MockModule } from 'ng-mocks';
import { ComponentsListComponent } from '../../component/components-list/components-list.component';
import {
  CustomComponentOutputData,
  CustomComponentValidationConditions
} from '../../component/components-list/components-list.types';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { ComponentDto } from '../../form-player/services/form-player-api/form-player-api.types';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { ScreenTypes } from '../screen.types';
import { CustomScreenComponent } from './custom-screen.component';

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
        CurrentAnswersService,
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
});
