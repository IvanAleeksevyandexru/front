import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ButtonComponent } from 'epgu-lib';

import { CustomScreenComponent } from './custom-screen.component';
import { RestService } from '../../services/rest/rest.service';
import { RestServiceStub } from '../../services/rest/rest.service.stub';
import { FormPlayerService } from '../../services/form-player/form-player.service';
import { FormPlayerServiceStub } from '../../services/form-player/form-player.service.stub';
import { CustomDisplayInterface } from '../../../interfaces/custom-component.interface';
import { SCREEN_TYPE } from '../../../constant/global';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { PageNameComponent } from '../../shared/components/page-name/page-name.component';
import { ScreenPadComponent } from '../../shared/components/screen-pad/screen-pad.component';
import { ComponentsListComponent } from '../../shared/components/components-list/components-list.component';


describe('CustomScreenComponent', () => {
  let component: CustomScreenComponent;
  let fixture: ComponentFixture<CustomScreenComponent>;
  let restService: RestService;
  let navService: NavigationService;
  let constructorService: FormPlayerService;
  let NavigationComponentMock = MockComponent(NavigationComponent);
  let ComponentsListComponentMock = MockComponent(ComponentsListComponent);
  const mockData: CustomDisplayInterface = {
    components: [],
    header: '',
    id: '',
    name: '',
    submitLabel: '',
    type: SCREEN_TYPE.COMPONENT
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CustomScreenComponent,
        PageNameComponent,
        ScreenPadComponent,
        ScreenContainerComponent,
        NavigationComponentMock,
        ComponentsListComponentMock,
        ButtonComponent
      ],
      providers: [
        NavigationService,
        { provide: RestService, useClass: RestServiceStub },
        { provide: FormPlayerService, useClass: FormPlayerServiceStub },
      ]
    })
    .compileComponents();
    restService = TestBed.inject(RestService);
    navService = TestBed.inject(NavigationService);
    constructorService = TestBed.inject(FormPlayerService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomScreenComponent);
    component = fixture.componentInstance;
    component.data = mockData;
    component.changeComponentsList({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check snapshot', () => {
    expect(fixture).toMatchSnapshot();
  });

  describe('navigation cases', () => {
    it('onClick lib button should call nextScreen()', () => {
      spyOn(component, 'nextScreen').and.callThrough();
      const button = fixture.debugElement.nativeElement.querySelector('.footer__btn-submit .button');
      button.click();
      fixture.detectChanges();
      expect(component.nextScreen).toHaveBeenCalled();
    });

    it('nextScreen() should call nextStepEvent emit', () => {
      spyOn(component.nextStepEvent, 'emit').and.callThrough();
      component.nextScreen();
      expect(component.nextStepEvent.emit).toHaveBeenCalled();
    });

    it('prevStep() should call prevStepEvent emit', () => {
      spyOn(component.prevStepEvent, 'emit').and.callThrough();
      component.prevStep();
      expect(component.prevStepEvent.emit).toHaveBeenCalled();
    });
  });
});
