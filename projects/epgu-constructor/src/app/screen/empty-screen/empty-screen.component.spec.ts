import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmptyScreenComponent } from './empty-screen.component';
import { ScreenStore, ScreenTypes } from '../screen.types';
import { ScreenService } from '../screen.service';
import { NavigationService } from '../../shared/services/navigation/navigation.service';
import { UnsubscribeService } from '../../services/unsubscribe/unsubscribe.service';
import { CachedAnswersService } from '../../shared/services/applicant-answers/cached-answers.service';
import { ComponentStateService } from '../../services/component-state/component-state.service';


// TODO: Need to refactoring component
describe.skip('EmptyScreenComponent', () => {
	let component: EmptyScreenComponent;
	let fixture: ComponentFixture<EmptyScreenComponent>;
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
      type: ScreenTypes.COMPONENT
    }
  };

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
			declarations: [EmptyScreenComponent],
      providers: [
        NavigationService,
        ScreenService,
        UnsubscribeService,
        CachedAnswersService,
        ComponentStateService
      ]
		})
			.compileComponents();
    screenService = TestBed.inject(ScreenService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmptyScreenComponent);
		component = fixture.componentInstance;
    screenService.updateScreenStore(screenDataMock);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
