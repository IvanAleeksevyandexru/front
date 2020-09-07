import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../constant/global';
import { ScreenService } from '../screen.service';
import { ScreenStore } from '../screen.types';
import { CustomScreenComponent } from '../custom-screen/custom-screen.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentScreenComponent } from './component-screen.component';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { ComponentStateService } from '../../services/component-state/component-state.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { FormBuilder } from '@angular/forms';


// TODO: Need to refactoring component
describe.skip('ComponentScreenComponent', () => {
  let component: ComponentScreenComponent;
  let fixture: ComponentFixture<ComponentScreenComponent>;
  let screenService: ScreenService;
  const screenDataMock: ScreenStore = {
    display: {
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
      declarations: [
        CustomScreenComponent
      ],
      providers: [
        NavigationService,
        ComponentStateService,
        UnsubscribeService,
        ScreenService,
        FormBuilder
      ]
    })
      .compileComponents();
    screenService = TestBed.inject(ScreenService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentScreenComponent);
    component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
