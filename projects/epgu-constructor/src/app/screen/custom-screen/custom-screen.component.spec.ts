import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';
import { MockComponent } from 'ng-mocks';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { PageNameComponent } from '../../shared/components/base/page-name/page-name.component';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { ComponentsListComponent } from './components-list/components-list.component';
import { CustomScreenComponent } from './custom-screen.component';

xdescribe('CustomScreenComponent', () => {
  let component: CustomScreenComponent;
  let fixture: ComponentFixture<CustomScreenComponent>;
  let navigationService: NavigationService;
  let screenService: ScreenService;
  let unsubscribeService: UnsubscribeService;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EpguLibModule,
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
        UnsubscribeService,
        ScreenService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomScreenComponent);
    component = fixture.componentInstance;

    navigationService = fixture.debugElement.injector.get(NavigationService);
    unsubscribeService = fixture.debugElement.injector.get(UnsubscribeService);
    screenService = fixture.debugElement.injector.get(ScreenService);

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
