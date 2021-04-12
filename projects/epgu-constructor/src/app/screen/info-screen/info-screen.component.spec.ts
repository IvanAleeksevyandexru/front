import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EpguLibModule } from 'epgu-lib';
import { MockComponents, MockDirective } from 'ng-mocks';
import { WINDOW_PROVIDERS } from '../../core/providers/window.provider';
import { ConfigService } from '../../core/services/config/config.service';
import { ConfigServiceStub } from '../../core/services/config/config.service.stub';
import { EventBusService } from '../../core/services/event-bus/event-bus.service';
import { LocationService } from '../../core/services/location/location.service';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import {
  ComponentActionDto,
  ComponentDto,
  DTOActionAction
} from '../../form-player/services/form-player-api/form-player-api.types';
import { PageNameComponent } from '../../shared/components/base-components/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { ActionDirective } from '../../shared/directives/action/action.directive';
import { CurrentAnswersService } from '../current-answers.service';
import { ScreenService } from '../screen.service';
import { ScreenServiceStub } from '../screen.service.stub';
import { InfoScreenBodyComponent } from './info-screen-body/info-screen-body.component';
import { InfoScreenComponent } from './info-screen.component';
import { BaseModule } from '../../shared/base.module';
import { ScreenButtonsModule } from '../../shared/components/screen-buttons/screen-buttons.module';
import { ActionService } from '../../shared/directives/action/action.service';
import { ActionServiceStub } from '../../shared/directives/action/action.service.stub';
import { ModalService } from '../../modal/modal.service';
import { ModalServiceStub } from '../../modal/modal.service.stub';

const componentSample: ComponentDto = {
  attrs: {},
  id: 'id1',
  type: 'type1',
};

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

describe('InfoScreenComponent', () => {
  let component: InfoScreenComponent;
  let fixture: ComponentFixture<InfoScreenComponent>;

  let navigationService: NavigationServiceStub;
  let screenService: ScreenServiceStub;
  let locationService: LocationService;
  let configService: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EpguLibModule,
        BaseModule,
        ScreenButtonsModule,
      ],
      declarations: [
        InfoScreenComponent,
        MockComponents(
          ScreenContainerComponent,
          ScreenPadComponent,
          PageNameComponent,
          InfoScreenBodyComponent,
        ),
        MockDirective(ActionDirective),
      ],
      providers: [
        LocationService,
        WINDOW_PROVIDERS,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: ScreenService, useClass: ScreenServiceStub },
        { provide: ConfigService, useClass: ConfigServiceStub },
        { provide: ActionService, useClass: ActionServiceStub },
        { provide: ModalService, useClass: ModalServiceStub },
        EventBusService,
        CurrentAnswersService,
      ],
    }).overrideComponent(InfoScreenComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoScreenComponent);
    component = fixture.componentInstance;
    navigationService = (TestBed.inject(NavigationService) as unknown) as NavigationServiceStub;
    screenService = (TestBed.inject(ScreenService) as unknown) as ScreenServiceStub;
    locationService = TestBed.inject(LocationService);
    configService = TestBed.inject(ConfigService);

    screenService.buttons = [componentActionDtoSample1, componentActionDtoSample2];
    fixture.detectChanges();
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

  it('should render epgu-constructor-screen-pad', () => {
    const selector = 'epgu-constructor-screen-container epgu-constructor-screen-pad';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();
  });

  it('should render epgu-constructor-page-name if screenService.header is not empty', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-page-name';

    let debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeNull();

    screenService.header = 'any';
    fixture.detectChanges();

    debugEl = fixture.debugElement.query(By.css(selector));
    expect(debugEl).toBeTruthy();

    expect(debugEl.nativeElement.textContent.trim()).toBe('any');
  });

  it('should render epgu-constructor-info-screen-body', () => {
    const selector =
      'epgu-constructor-screen-container epgu-constructor-screen-pad epgu-constructor-info-screen-body';

    const debugEl = fixture.debugElement.query(By.css(selector));

    expect(debugEl).toBeTruthy();

    expect(debugEl.componentInstance.data).toBe(null);

    screenService.component = componentSample;
    fixture.detectChanges();

    expect(debugEl.componentInstance.data).toBe(componentSample);
  });

  describe('lib-social-share', () => {
    const selector = 'epgu-constructor-screen-container lib-social-share';

    it('should be rendered if not hideSocialShare and not terminal', () => {
      let debugEl: DebugElement;
      screenService.component = {
        ...componentSample,
        attrs: {
          hideSocialShare: false
        }
      };
      screenService.terminal = false;
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeTruthy();

      screenService.component = {
        ...componentSample,
        attrs: {
          hideSocialShare: false
        }
      };
      screenService.terminal = true;
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();

      screenService.component = {
        ...componentSample,
        attrs: {
          hideSocialShare: true
        }
      };
      screenService.terminal = false;
      fixture.detectChanges();
      debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl).toBeNull();
    });

    it('isNewDesignDisabled property should be true if isSocialShareDisabled true', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      configService['_isSocialShareDisabled'] = false;

      fixture.detectChanges();
      expect(debugEl.componentInstance.isNewDesignDisabled).toBeFalsy();

      configService['_isSocialShareDisabled'] = true;
      fixture.detectChanges();
      expect(debugEl.componentInstance.isNewDesignDisabled).toBeTruthy();
    });

    it('url property', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      jest.spyOn(locationService, 'getHref').mockReturnValue('http://example.com');
      fixture.detectChanges();
      expect(debugEl.componentInstance.url).toBe('http://example.com');
    });

    it('isNewDesign property should be true', () => {
      const debugEl = fixture.debugElement.query(By.css(selector));
      expect(debugEl.componentInstance.isNewDesign).toBeTruthy();
    });
  });

});
