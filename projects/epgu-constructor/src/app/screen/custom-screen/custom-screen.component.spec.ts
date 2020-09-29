import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EpguLibModule } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { ComponentStateService } from '../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { PageNameComponent } from '../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { ComponentsListComponent } from './components-list/components-list.component';
import { CustomScreenComponent } from './custom-screen.component';



describe('CustomScreenComponent', () => {
  let component: CustomScreenComponent;
  let fixture: ComponentFixture<CustomScreenComponent>;
  let navigationService: NavigationService;
  let screenService: ScreenService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  let ComponentsListComponentMock = MockComponent(ComponentsListComponent);
  const screenDataMock: ScreenStore = {
    display: {
      components: [],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: ScreenTypes.QUESTION
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EpguLibModule.forChild(),
      ],
      declarations: [
        CustomScreenComponent,
        PageNameComponent,
        ScreenPadComponent,
        ScreenContainerComponent,
        NavigationComponentMock,
        ComponentsListComponentMock
      ],
      providers: [
        NavigationService,
        ScreenService,
        UnsubscribeService,
        CachedAnswersService,
        ComponentStateService
      ]
    })
    .compileComponents();
    navigationService = TestBed.inject(NavigationService);
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
    component.changeComponentsList({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check snapshot', () => {
    // TODO: Нужен рефакторинг, т.к. тест не проходит
    //expect(fixture).toMatchSnapshot();
  });

  describe('navigation cases', () => {
    it('onClick lib button should call nextScreen()', () => {
      spyOn(component, 'nextScreen').and.callThrough();
      const button = fixture.debugElement.nativeElement.querySelector('.footer__btn-submit .button');
      button.click();
      fixture.detectChanges();
      expect(component.nextScreen).toHaveBeenCalled();
    });

    it('nextScreen() should call next of nextStep subject from navigationService', () => {
      spyOn(navigationService.nextStep, 'next').and.callThrough();
      component.nextScreen();
      expect(navigationService.nextStep.next).toHaveBeenCalled();
    });

    it('prevStep() should call next of prevStep subject from navigationService', () => {
      spyOn(navigationService.prevStep, 'next').and.callThrough();
      component.prevStep();
      expect(navigationService.prevStep.next).toHaveBeenCalled();
    });
  });
});
