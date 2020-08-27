import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SCREEN_TYPE } from '../../../../../constant/global';
import { DisplayInterface } from '../../../../../interfaces/epgu.service.interface';
import { ConstructorServiceStub } from '../../../../services/constructor/constructor.service.stub';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { ScreenContainerComponent } from '../../../../shared-module/components/screen-container/screen-container.component'
import { EmptyComponent } from './empty.component';
import { NavigationService } from '../../../../shared-module/service/navigation/navigation.service';
import { ConstructorService } from '../../../../services/constructor/constructor.service';
import { ScreenComponentService } from '../../../screen/service/screen-component/screen-component.service';


// TODO: Need to refactoring component
describe.skip('EmptyComponent', () => {
	let component: EmptyComponent;
	let fixture: ComponentFixture<EmptyComponent>;
	let navService: NavigationService;
	let constructorService: ConstructorService;
	let screenComponentService: ScreenComponentService;
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
			declarations: [EmptyComponent, ScreenContainerComponent],
			providers: [
				NavigationService,
				{ provide: ConstructorService, useClass: ConstructorServiceStub },
				ScreenComponentService
			]
		})
			.compileComponents();
		navService = TestBed.inject(NavigationService);
		constructorService = TestBed.inject(ConstructorService);
		screenComponentService = TestBed.inject(ScreenComponentService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EmptyComponent);
		component = fixture.componentInstance;
		component.data = mockData;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
