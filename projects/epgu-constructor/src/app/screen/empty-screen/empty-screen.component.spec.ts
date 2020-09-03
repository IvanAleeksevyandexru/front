import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../constant/global';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmptyScreenComponent } from './empty-screen.component';
import { ScreenData } from '../../../interfaces/screen.interface';
import { ScreenService } from '../screen.service';
import { NavigationService } from '../../shared/service/navigation/navigation.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';


// TODO: Need to refactoring component
describe.skip('EmptyScreenComponent', () => {
	let component: EmptyScreenComponent;
	let fixture: ComponentFixture<EmptyScreenComponent>;
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
			schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
			declarations: [EmptyScreenComponent],
      providers: [NavigationService, ScreenService, UnsubscribeService]
		})
			.compileComponents();
    screenService = TestBed.inject(ScreenService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmptyScreenComponent);
		component = fixture.componentInstance;
    screenService.updateScreenData(screenDataMock);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
