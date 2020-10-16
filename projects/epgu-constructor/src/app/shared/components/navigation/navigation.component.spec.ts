import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationComponent } from './navigation.component';
import { NavigationService } from '../../services/navigation/navigation.service';
import { MockComponent } from 'ng-mocks';
import { ScreenContainerComponent } from '../screen-container/screen-container.component';
import { ScreenService } from '../../../screen/screen.service';
import { ScreenServiceStub } from '../../../screen/screen.service.stub';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let ScreenContainerComponentMock = MockComponent(ScreenContainerComponent);
  let screenService: ScreenService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationComponent, ScreenContainerComponentMock ],
      providers: [
        NavigationService,
        { provide: ScreenService, useClass: ScreenServiceStub },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    screenService = fixture.debugElement.injector.get(ScreenService);
    jest.spyOn(screenService, 'applicantAnswers', 'get').mockReturnValue({});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
