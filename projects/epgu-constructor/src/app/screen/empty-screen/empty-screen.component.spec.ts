import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../constant/global';
import { DisplayInterface } from '../../../interfaces/epgu.service.interface';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { EmptyScreenComponent } from './empty-screen.component';


// TODO: Need to refactoring component
describe.skip('EmptyScreenComponent', () => {
	let component: EmptyScreenComponent;
	let fixture: ComponentFixture<EmptyScreenComponent>;
	const mockData: DisplayInterface = {
		components: [{
			attrs: {},
			id: '',
			label: '',
			type: '',
			value: ''
		}],
		header: '',
		id: '',
		name: '',
		submitLabel: '',
		type: SCREEN_TYPE.EMPTY
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA], // TODO: remove this line when resolve issue with @ifc/plugin and @ifc/common dependencies
			declarations: [EmptyScreenComponent],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmptyScreenComponent);
		component = fixture.componentInstance;
		component.data = mockData;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
