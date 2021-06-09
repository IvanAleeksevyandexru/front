import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy } from '@angular/core';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';
import { MockProvider } from 'ng-mocks';
import { By } from '@angular/platform-browser';

import { EmptyScreenComponent } from './empty-screen.component';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { EmptyScreenComponentTypes } from '../../component/empty-screen/empty-screen-components.types';
import { RedirectComponent } from '../../component/empty-screen/components/redirect.component';
import { InitDataService } from '../../core/services/init-data/init-data.service';
import { InitDataServiceStub } from '../../core/services/init-data/init-data.service.stub';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { LocationService, LocationServiceStub } from '@epgu/epgu-constructor-ui-kit';
import { LoggerService } from '../../core/services/logger/logger.service';
import { LoggerServiceStub } from '../../core/services/logger/logger.service.stub';
import { ApplicantAnswersDto, ComponentDto } from '@epgu/epgu-constructor-types';
import { FileDownloaderService } from '../../shared/services/file-downloader/file-downloader.service';
import { ActionService } from '../../shared/directives/action/action.service';

describe('EmptyScreenComponent', () => {
  let component: EmptyScreenComponent;
  let fixture: ComponentFixture<EmptyScreenComponent>;

  let screenService: ScreenService;
  let locationService: LocationService;
  let navigationService: NavigationService;
  let loggerService: LoggerService;
  let fileDownloaderService: FileDownloaderService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyScreenComponent, RedirectComponent],
      providers: [
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: LocationService, useClass: LocationServiceStub },
        { provide: LoggerService, useClass: LoggerServiceStub },
        MockProvider(FileDownloaderService),
        MockProvider(ActionService),
      ],
    }).overrideComponent(EmptyScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    });
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    locationService = TestBed.inject(LocationService);
    navigationService = TestBed.inject(NavigationService);
    loggerService = TestBed.inject(LoggerService);
    fileDownloaderService = TestBed.inject(FileDownloaderService);

    fixture = TestBed.createComponent(EmptyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  describe('download', () => {
    it('should be call fileDownloaderService.download', () => {
      const mockComponent = {
        attrs: {
          downloadLink: 'test',
        },
        id: 'id1',
        type: 'type1',
      };
      screenService.component = mockComponent;
      fixture.detectChanges();
      const spy = jest.spyOn(fileDownloaderService, 'download');
      component.redirectLink$.subscribe();

      expect(spy).toBeCalledWith('test');
    });

    it('should be not call fileDownloaderService.download', () => {
      const mockComponent = {
        attrs: {},
        id: 'id1',
        type: 'type1',
      };
      screenService.component = mockComponent;
      fixture.detectChanges();
      const spy = jest.spyOn(fileDownloaderService, 'download');
      component.redirectLink$.subscribe();

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
