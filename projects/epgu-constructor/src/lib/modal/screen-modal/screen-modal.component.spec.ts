import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockModule, MockProvider } from 'ng-mocks';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DatesToolsService,
  ERROR_HANDLER_ORDER_PARAMS_SERVICES,
  ObjectHelperService,
  WordTransformService,
  UnsubscribeService,
  CoreUiModule,
} from '@epgu/epgu-constructor-ui-kit';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScreenTypes } from '@epgu/epgu-constructor-types';
import { ScreenModalComponent } from './screen-modal.component';
import { ComponentListModalComponent } from './components/component-list-modal/component-list-modal.component';
import { BaseModule } from '../../shared/base.module';
import { UniqueComponentModalModule } from './components/unique-component-modal/unique-component-modal.module';
import { InfoComponentModalModule } from './components/info-component-modal/info-component-modal.module';
import { NavigationModalService } from '../../core/services/navigation-modal/navigation-modal.service';
import { ScreenService } from '../../screen/screen.service';
import { ScreenModalService } from './screen-modal.service';
import { CustomScreenService } from '../../screen/custom-screen/custom-screen.service';
import { FormPlayerService } from '../../form-player/services/form-player/form-player.service';
import { FormPlayerApiService } from '../../form-player/services/form-player-api/form-player-api.service';
import { HtmlRemoverService } from '../../shared/services/html-remover/html-remover.service';
import { CurrentAnswersService } from '../../screen/current-answers.service';
import { PrepareComponentsService } from '../../shared/services/prepare-components/prepare-components.service';
import { CachedAnswersService } from '../../shared/services/cached-answers/cached-answers.service';

import { DictionaryToolsService } from '../../shared/services/dictionary/dictionary-tools.service';
import { ComponentsListModule } from '../../component/custom-screen/components-list.module';
import { RefRelationService } from '../../shared/services/ref-relation/ref-relation.service';
import { FormPlayerServiceStub } from '../../form-player/services/form-player/form-player.service.stub';
import { ScreenModalServiceStub } from './screen-modal.service.stub';
import { ScreenModalResolverComponent } from './screen-modal-resolver/screen-modal-resolver.component';

import { InitDataService } from '../../core/services/init-data/init-data.service';
import { InitDataServiceStub } from '../../core/services/init-data/init-data.service.stub';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';
import { ErrorHandlerOrderParamsServiceService } from '../../core/services/error-handler-order-params-service/error-handler-order-params-service.service';

describe('ScreenModalComponent', () => {
  let component: ScreenModalComponent;
  let fixture: ComponentFixture<ScreenModalComponent>;
  let screenService: ScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScreenModalComponent,
        MockComponent(ComponentListModalComponent),
        MockComponent(ScreenModalResolverComponent),
      ],
      imports: [
        RouterTestingModule,
        BaseModule,
        CoreUiModule,
        ComponentsListModule,
        UniqueComponentModalModule,
        InfoComponentModalModule,
        HttpClientTestingModule,
      ],
      providers: [
        ScreenService,
        FormPlayerApiService,
        NavigationModalService,
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: InitDataService, useClass: InitDataServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
        { provide: ScreenModalService, useClass: ScreenModalServiceStub },
        CustomScreenService,
        DatesToolsService,
        HtmlRemoverService,
        CurrentAnswersService,
        MockProvider(PrepareComponentsService),
        CachedAnswersService,
        UnsubscribeService,
        WordTransformService,
        ObjectHelperService,
        DictionaryToolsService,
        RefRelationService,
        {
          provide: ERROR_HANDLER_ORDER_PARAMS_SERVICES,
          useClass: ErrorHandlerOrderParamsServiceService,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenModalComponent);
    component = fixture.componentInstance;
    screenService = TestBed.inject(ScreenService);
    component.isMobile = true;
    component.isValid = true;
    screenService.screenType = ScreenTypes.CUSTOM;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    const spy = jest.fn();
    const testWidth = 420;
    it('should check platform is not mobile', () => {
      expect(component.isMobile).toBeFalsy();
    });
    it('does not fire resize event by default', () => {
      window.addEventListener('resize', spy);
      expect(spy).not.toHaveBeenCalled();
      expect(window.innerWidth).not.toBe(testWidth);
    });
    describe('when resize event is fired', () => {
      beforeAll(() => {
        // @ts-ignore
        window.innerWidth = testWidth;
        window.dispatchEvent(new Event('resize'));
      });

      it('updates the window width', () => {
        expect(spy).toHaveBeenCalled();
        expect(window.innerWidth).toBe(testWidth);
      });
    });
    it('should set showModal on playerLoaded$ event ', (done) => {
      component.screenModalService.playerLoaded$.subscribe((showModal) => {
        expect(showModal).toBeFalsy();
        done();
      });
    });
    it('should call nextStep on nextStep$ event ', () => {
      const nextStepSpy = jest.spyOn(component, 'nextStep');
      const navigation = {
        options: { isInternalScenarioFinish: true },
      };
      component.navModalService.next(navigation);
      expect(nextStepSpy).toHaveBeenCalled();
    });
    it('should call prevStep on prevStep$ event ', () => {
      const prevStepSpy = jest.spyOn(component, 'prevStep');
      const navigation = {
        options: { isInternalScenarioFinish: true },
      };
      component.navModalService.prev(navigation);
      expect(prevStepSpy).toHaveBeenCalled();
    });
  });

  describe('nextStep', () => {
    it('sould call closeModalOnNext(), if scenario finished', () => {
      const closeModalSpy = jest.spyOn(component, 'closeModalOnNext');
      const navigation = {
        options: { isInternalScenarioFinish: true },
      };
      component.nextStep(navigation);
      expect(closeModalSpy).toHaveBeenCalled();
    });
    it('sould call navigate(), if scenario not finished', () => {
      const navigateSpy = jest.spyOn(component.screenModalService, 'navigate');
      const navigation = {
        options: { isInternalScenarioFinish: false },
      };
      component.nextStep(navigation);
      expect(navigateSpy).toHaveBeenCalled();
    });
  });

  describe('prevStep', () => {
    it('sould call closeModal(), if scenario finished', () => {
      const closeModalSpy = jest.spyOn(component, 'closeModal');
      const navigation = {
        options: { isInternalScenarioFinish: true },
      };
      component.prevStep(navigation);
      expect(closeModalSpy).toHaveBeenCalled();
    });
    it('sould call navigate(), if scenario not finished', () => {
      const navigateSpy = jest.spyOn(component.screenModalService, 'navigate');
      const navigation = {
        options: { isInternalScenarioFinish: false },
      };
      component.prevStep(navigation);
      expect(navigateSpy).toHaveBeenCalled();
    });
  });

  describe('closeModal', () => {
    it('sould call switchNavigationToFormPlayer()', () => {
      const switchNavigationToFormPlayerSpy = jest.spyOn<any, string>(
        component,
        'switchNavigationToFormPlayer',
      );
      component.showModal = true;
      component.closeModal();
      expect(switchNavigationToFormPlayerSpy).toHaveBeenCalled();
    });
    it('sould call screenModalService.resetStore()', () => {
      const resetStoreSpy = jest.spyOn<any, string>(component.screenModalService, 'resetStore');
      component.showModal = true;
      component.closeModal();
      expect(resetStoreSpy).toHaveBeenCalled();
    });
    it('sould not call any, if showModal is false', () => {
      const switchNavigationToFormPlayerSpy = jest.spyOn<any, string>(
        component,
        'switchNavigationToFormPlayer',
      );
      const resetStoreSpy = jest.spyOn(component.screenModalService, 'resetStore');
      component.showModal = false;
      component.closeModal();
      expect(switchNavigationToFormPlayerSpy).not.toHaveBeenCalled();
      expect(resetStoreSpy).not.toHaveBeenCalled();
    });
  });
});
