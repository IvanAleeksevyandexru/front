import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpguLibModule } from 'epgu-lib';
import { MockComponent, MockModule, MockService } from 'ng-mocks';
import * as moment_ from 'moment';
import { UnsubscribeService } from '../../core/services/unsubscribe/unsubscribe.service';
import { PageNameComponent } from '../../shared/components/base/page-name/page-name.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { NavigationService } from '../../core/services/navigation/navigation.service';
import { ScreenService } from '../screen.service';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { ComponentsListComponent } from '../../component/components-list/components-list.component';
import { CustomScreenComponent } from './custom-screen.component';
import { Subject } from 'rxjs';
import { Navigation } from '../../form-player/form-player.types';
import { CustomComponentValidationConditions } from '../../component/components-list/components-list.types';
import { ScreenServiceStub } from '../screen.service.stub';
import { NavigationServiceStub } from '../../core/services/navigation/navigation.service.stub';

const moment = moment_;

describe('CustomScreenComponent', () => {
  let component: CustomScreenComponent;
  let fixture: ComponentFixture<CustomScreenComponent>;
  let screenService: ScreenService;
  let unsubscribeService: UnsubscribeService;
  let navigationService: NavigationService;

  const screenDataMock: ScreenStore = {
    display: {
      components: [],
      terminal: false,
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
        MockModule(EpguLibModule)
      ],
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
        { provide: UnsubscribeService, useValue: MockService(UnsubscribeService) },
      ]
    });

    fixture = TestBed.createComponent(CustomScreenComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    screenService = TestBed.inject(ScreenService);
    navigationService = TestBed.inject(NavigationService);
    unsubscribeService = TestBed.inject(UnsubscribeService);
  });

  it('should create', () => {
    screenService.initScreenStore(screenDataMock);
    component.changeComponentsList({});
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('check snapshot', () => {
    expect(fixture).toMatchSnapshot();
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

  describe('changeComponentList method', () => {
    const expectedDataSend = { any: { value: 'any', visited: true, disabled: undefined }};

    it('condition === atLeastOne', () => {
      const changes = { any: { condition: CustomComponentValidationConditions.atLeastOne, isValid: true, value: 'any' }};

      component.changeComponentsList(changes);

      expect(component.isValid).toBeTruthy();
      expect(component.dataToSend).toEqual(expectedDataSend);
    });

    it('condition !== atLeastOne', () => {
      const changes = { any: { condition: 'any', isValid: false, value: 'any' }};

      component.changeComponentsList(changes);

      expect(component.isValid).toBeFalsy();
      expect(component.dataToSend).toEqual(expectedDataSend);
    });
  });

  describe('getPrepareResponseData method',() => {
    it('without data', () => {
      //@ts-ignore
      const result = component.getPrepareResponseData();
      //@ts-ignore
      expect(result).toEqual({});
    });
  });

  describe('getFormattedData method',() => {
    it('without data', () => {
      const date = new Date();
      const changes = { any: { value: date }};
      const expectedResult = { any: { visited: true, disabled: undefined, value: moment(date).toISOString() }};

      const result = component.getFormattedData(changes);

      expect(result).toEqual(expectedResult);
    });
  });
});
