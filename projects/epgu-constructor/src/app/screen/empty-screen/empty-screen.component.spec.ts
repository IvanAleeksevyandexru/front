import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyScreenComponent } from './empty-screen.component';
import { ScreenService } from '../screen.service';
import { MockComponent } from 'ng-mocks';
import { ScreenServiceStub } from '../screen.service.stub';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';
import { RedirectComponent } from '../../component/empty-screen/components/redirect.component';
import { By } from '@angular/platform-browser';
import { ChangeDetectionStrategy } from '@angular/core';
import { InitDataService } from '../../core/services/init-data/init-data.service';
import { InitDataServiceStub } from '../../core/services/init-data/init-data.service.stub';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { LocationService } from '../../core/services/location/location.service';
import { LocationServiceStub } from '../../core/services/location/location.service.stub';
import { LoggerService } from '../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../core/services/logger/logger.service.stub';
import { of } from 'rxjs';
import {
  ApplicantAnswersDto,
  ComponentDto,
} from '../../form-player/services/form-player-api/form-player-api.types';
import { configureTestSuite } from 'ng-bullet';

describe('EmptyScreenComponent', () => {
  let component: EmptyScreenComponent;
  let fixture: ComponentFixture<EmptyScreenComponent>;

  let screenService: ScreenServiceStub;
  let locationService: LocationServiceStub;
  let navigationService: NavigationServiceStub;
  let loggerService: LoggerServiceStub;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyScreenComponent, RedirectComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
      ],
    }).overrideComponent(EmptyScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.OnPush },
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyScreenComponent);
    component = fixture.componentInstance;

    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    locationService = (TestBed.inject(LocationService) as unknown) as LocationServiceStub;
    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    loggerService = (TestBed.inject(LoggerService) as unknown) as LoggerServiceStub;
  });

  describe('emptyComponentName property', () => {
    it('should be EmptyScreenComponentTypes by default', () => {
      expect(component.emptyComponentName).toBe(EmptyScreenComponentTypes);
    });
  });

  describe('redirectLink() getter', () => {
    it('should return link from ref if ref exists', () => {
      const applicantAnswers = {
        ref1: {
          visited: true,
          value: 'http://example.com',
        },
      } as ApplicantAnswersDto;
      const componentSchema = {
        attrs: {
          ref: 'ref1',
        },
        id: 'id1',
        type: 'type1',
      } as ComponentDto;

      spyOn(locationService, 'href').and.callThrough();
      component.createLink([componentSchema, applicantAnswers])();

      expect(locationService.href).toHaveBeenCalledWith('http://example.com');
    });

    it('should return link from component if ref does not exist', () => {
      const componentSchema = {
        attrs: {
          link: 'http://example.com',
        },
        id: 'id1',
        type: 'type1',
      } as ComponentDto;

      spyOn(locationService, 'href').and.callThrough();
      component.createLink([componentSchema, {}])();

      expect(locationService.href).toHaveBeenCalledWith('http://example.com');
    });

    it('should to redirectToLK', () => {
      spyOn(navigationService, 'redirectToLK').and.callThrough();
      fixture = TestBed.createComponent(EmptyScreenComponent);
      component = fixture.componentInstance;
      const componentSchema = {
        attrs: {
          actions: [{ type: 'redirectToLK' }],
        },
        id: 'id1',
        type: 'type1',
      } as ComponentDto;

      component.createLink([componentSchema, {}])();

      expect(navigationService.redirectToLK).toHaveBeenCalled();
    });
    it('should to Home', () => {
      spyOn(navigationService, 'redirectToHome').and.callThrough();
      fixture = TestBed.createComponent(EmptyScreenComponent);
      component = fixture.componentInstance;
      const componentSchema = {
        attrs: {
          actions: [{ type: 'home' }],
        },
        id: 'id1',
        type: 'type1',
      } as ComponentDto;

      component.createLink([componentSchema, {}])();

      expect(navigationService.redirectToHome).toHaveBeenCalled();
    });
    it('should other type action', () => {
      spyOn(navigationService, 'redirectToHome').and.callThrough();
      fixture = TestBed.createComponent(EmptyScreenComponent);
      component = fixture.componentInstance;
      const componentSchema = {
        attrs: {
          actions: [{ type: 'download' }],
        },
        id: 'id1',
        type: 'type1',
      } as ComponentDto;

      component.createLink([componentSchema, {}])();

      expect(navigationService.redirectToHome).toHaveBeenCalled();
    });
    it('should unknown', () => {
      spyOn(loggerService, 'error').and.callThrough();
      fixture = TestBed.createComponent(EmptyScreenComponent);
      component = fixture.componentInstance;
      const componentSchema = {
        attrs: {},
        id: 'id1',
        type: 'type1',
      } as ComponentDto;

      component.createLink([componentSchema, {}])();

      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  it('should render epgu-constructor-redirect', () => {
    const selector = 'epgu-constructor-redirect';
    const func = jest.fn();
    component.redirectLink$ = of(func);
    let debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeNull();

    screenService.componentType = EmptyScreenComponentTypes.redirect;
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.link).toBeUndefined();

    fixture.detectChanges();

    expect(func).toHaveBeenCalled();
  });
});
