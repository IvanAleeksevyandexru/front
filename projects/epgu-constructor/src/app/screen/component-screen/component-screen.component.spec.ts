import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../constant/global';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { ComponentStateService } from '../../services/component-state/component-state.service';
import { ComponentScreenComponent } from './component-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ScreenContainerComponent } from '../../shared/components/screen-container/screen-container.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ScreenService } from '../screen.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { ScreenData } from '../screen.types';


// TODO: Need to refactoring component
describe.skip('ScreenComponent', () => {
  let component: ComponentScreenComponent;
  let fixture: ComponentFixture<ComponentScreenComponent>;
  let navService: NavigationService;
  let componentStateService: ComponentStateService;
  let screenService: ScreenService;
  const screenDataMock: ScreenData = {
    componentData: {
      components: [
        {
          attrs: {},
          type: '',
          id: '',
          label: '',
          value: ''
        }
      ],
      header: '',
      id: '',
      name: '',
      submitLabel: '',
      type: SCREEN_TYPE.COMPONENT
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      imports: [ReactiveFormsModule],
      declarations: [ ComponentScreenComponent, ScreenContainerComponent ],
      providers: [
        NavigationService,
        ComponentStateService,
        ScreenService,
        UnsubscribeService
      ]
    })
    .compileComponents();
    navService = TestBed.inject(NavigationService);
    componentStateService = TestBed.inject(ComponentStateService);
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenData(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
